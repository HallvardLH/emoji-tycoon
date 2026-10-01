import { updateEmojis } from "../redux/valuesSlice";
import store from "../redux/reduxStore";
import { canBuyBuilding, unlockBuilding } from "./buildings/checks";
import { unlockUpgrades } from "./upgrades/checks";
import { decrementEffects } from "./effects/effects";
import { decrementEffectsOnScreen, spawnEffect } from "./effects/onScreenEffects";
import { updateTimeSinceLastEffect } from "../redux/effectsSlice";
import { generateCollection } from "./collection/emojiCategories";
import { pickNextEmoji } from "./bigEmoji";
import { calculateEpt, calculateEmojisPerSecond } from "./calculations";
import { hasPerk } from "./prestige/perks";
import { canBuyUpgrade } from "./upgrades/checks";
import { addEmojisGained } from "../redux/statsSlice";
import { calculateBuildingsEps, syncBuildingPrices } from "./buildings/buildings";
import { calculateRemainingEmojisForNextPrestige, startPrestige, updateLastSeen, trackRunPeak } from "./prestige/prestige";
import { decrementTapBoost } from "./tapBoost";
import { checkBankMilestone } from "./milestones";
import { setComboTaps } from "../redux/statsSlice";

let lastUpdateTime = Date.now();
let started = false;
let loggedBigEmojiTaps = 0;

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

export function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdateTime) / 1000; // time in seconds since last update
    lastUpdateTime = now;

    // cache state once per frame
    const state = store.getState();

    giveEmojis(delta, state);

    // Runs once at game start
    if (!started) {
        started = true;
        store.dispatch(updateTimeSinceLastEffect(0)); // reset timer
        generateCollection();
        syncBuildingPrices();
        pickNextEmoji();
        calculateEpt();
        calculateBuildingsEps();
        // Migrates old saves and pays out offline earnings (needs the production just calculated)
        startPrestige();
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
        // Collector's pride (perk) grows as the collection does
        if (hasPerk("collectorsPride")) calculateEmojisPerSecond();
        trackRunPeak();

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
    store.dispatch(updateTimeSinceLastEffect(store.getState().effects.timeSinceLastEffect + 1));
    decrementEffects();
    decrementEffectsOnScreen();
    spawnEffect();
    calculateRemainingEmojisForNextPrestige();
    updateLastSeen();
    checkBankMilestone();
}

export function giveEmojis(delta: number, state = store.getState()) {
    const { emojisPerSecond, emojis } = state.values;
    const gained = emojisPerSecond * delta;

    store.dispatch(updateEmojis(emojis + gained));
    store.dispatch(addEmojisGained(gained));
}
