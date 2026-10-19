import { updateEmojis } from "../redux/valuesSlice";
import store from "../redux/reduxStore";
import { canBuyBuilding, unlockBuilding } from "./buildings/checks";
import { syncTapModifiers } from "./upgrades/upgrades";
import { unlockUpgrades, pruneUnknownUpgrades } from "./upgrades/checks";
import { decrementEffects } from "./effects/effects";
import { decrementEffectsOnScreen, spawnEffect } from "./effects/onScreenEffects";
import { updateTimeSinceLastEffect } from "../redux/effectsSlice";
import { generateCollection } from "./collection/emojiCategories";
import { pickNextEmoji } from "./bigEmoji";
import { calculateEpt, calculateEmojisPerSecond } from "./calculations";
import { hasChangingProductionPerk } from "./prestige/perks";
import { checkTrial } from "./prestige/trials";
import { addRunSeconds } from "../redux/prestigeSlice";
import { canBuyUpgrade } from "./upgrades/checks";
import { addEmojisGained } from "../redux/statsSlice";
import { calculateBuildingsEps, syncBuildingPrices } from "./buildings/buildings";
import { calculateRemainingEmojisForNextPrestige, startPrestige, updateLastSeen, trackRunPeak, trackEssenceRate } from "./prestige/prestige";
import { decrementTapBoost } from "./tapBoost";
import { checkBankMilestone } from "./milestones";
import { setComboTaps } from "../redux/statsSlice";
import { AWAY_THRESHOLD_SECONDS, isGameHidden, registerAway } from "./offline";
import { getGameSpeed } from "./gameSpeed";
import { creditBuildings } from "./buildings/buildingTotals";
import { checkAchievements } from "./achievements";

let lastUpdateTime = Date.now();
let started = false;
let loggedBigEmojiTaps = 0;
// Set while the game is hidden: when it was last seen
let awaySince: number | undefined;
// Time played since it was last added to the run's play time (once a second)
let playedSeconds = 0;

// Timers run on real elapsed time, not on how often the loop gets to run: when the
// page lags, the 100ms interval fires late, and counting ticks stretched every
// "second" (effects lasted far longer than they said, and their bars jumped back).
// Both start full, so they run on the first frame.
let untilSecond = 0;
let untilCheck = 0;
const CHECK_INTERVAL = 2.5;
// After a long pause (the app in the background), catch up at most this many seconds
// of timers. Longer than any effect lasts, so they all still run out.
const MAX_CATCH_UP_SECONDS = 60;

/** When the last game tick ran, so the header can count the bank up between ticks */
export const getLastTickTime = () => lastUpdateTime;

export function gameLoop() {
    const now = Date.now();
    // time in seconds since last update. Nothing on the first frame: the loop only starts once the save is in
    const delta = started ? (now - lastUpdateTime) / 1000 : 0;
    lastUpdateTime = now;

    // cache state once per frame
    const state = store.getState();

    // Nothing is produced while the game is away; coming back offers offline earnings (see offline.ts).
    // Away is either hidden (a background tab keeps running, slowly) or a long gap between frames
    // (the app was suspended, or the device slept).
    if (isGameHidden()) {
        // When the game was last seen
        awaySince ??= now - delta * 1000;
    } else if (awaySince !== undefined) {
        registerAway((now - awaySince) / 1000);
        awaySince = undefined;
    } else if (delta > AWAY_THRESHOLD_SECONDS) {
        registerAway(delta);
    } else {
        // Debug speed (cheat) runs production and play time faster
        const speed = getGameSpeed();
        giveEmojis(delta * speed, state);
        playedSeconds += delta * speed;
    }

    // Runs once at game start
    if (!started) {
        started = true;
        store.dispatch(updateTimeSinceLastEffect(0)); // reset timer
        generateCollection();
        syncBuildingPrices();
        pruneUnknownUpgrades();
        // Saves keep the tap values upgrades had when bought; pick up the current ones
        syncTapModifiers();
        pickNextEmoji();
        calculateEpt();
        calculateBuildingsEps();
        // Migrates old saves and offers offline earnings (needs the production just calculated)
        const lastSeen = state.prestige.lastSeen;
        startPrestige();
        // Catch up the timers for the time the game was closed, so saved effects have run out
        if (lastSeen) untilSecond -= Math.max(0, (now - lastSeen) / 1000);
        loggedBigEmojiTaps = state.stats.bigEmojiTaps;
    }

    // Every 2.5s
    untilCheck -= delta;
    if (untilCheck <= 0) {
        untilCheck = CHECK_INTERVAL;
        // Saves from before combo taps existed: count each past tap once, so players
        // who tapped a lot don't start the combo level upgrades from zero
        if (state.stats.comboTaps === undefined) {
            store.dispatch(setComboTaps(state.stats.bigEmojiTaps));
        }

        canBuyBuilding();
        unlockBuilding();
        canBuyUpgrade();
        // Collector's pride and Momentum (perks) grow during a run
        if (hasChangingProductionPerk()) calculateEmojisPerSecond();
        trackRunPeak();
        trackEssenceRate();
        checkTrial();
        checkAchievements();

        // detect new tap
        if (loggedBigEmojiTaps !== state.stats.bigEmojiTaps) {
            loggedBigEmojiTaps = state.stats.bigEmojiTaps;
            unlockUpgrades();
        }
    }

    // Every 1s, once for each second that has passed
    untilSecond -= delta;
    let caughtUp = 0;
    while (untilSecond <= 0 && caughtUp < MAX_CATCH_UP_SECONDS) {
        untilSecond += 1;
        caughtUp++;
        everySecond();
    }
    // Past the catch-up limit, drop the rest of the pause
    if (untilSecond <= 0) untilSecond = 1;

    decrementTapBoost(Math.min(delta, 1));
}

function everySecond() {
    // The run's play time, for Momentum (perk) and the essence rate
    if (playedSeconds > 0) {
        store.dispatch(addRunSeconds(playedSeconds));
        playedSeconds = 0;
    }
    store.dispatch(updateTimeSinceLastEffect(store.getState().effects.timeSinceLastEffect + 1));
    decrementEffects();
    decrementEffectsOnScreen();
    spawnEffect();
    calculateRemainingEmojisForNextPrestige();
    // Not while hidden, so closing a hidden game still counts the time it was hidden as away
    if (!isGameHidden()) updateLastSeen();
    checkBankMilestone();
}

export function giveEmojis(delta: number, state = store.getState()) {
    const { emojisPerSecond, emojis } = state.values;
    const gained = emojisPerSecond * delta;

    store.dispatch(updateEmojis(emojis + gained));
    store.dispatch(addEmojisGained(gained));
    creditBuildings(gained);
}
