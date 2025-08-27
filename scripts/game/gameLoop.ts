import { updateEmojis } from "../redux/valuesSlice";
import store from "../redux/reduxStore";
import { canBuyBuilding, unlockBuilding } from "./buildings/checks";
import { unlockUpgrades } from "./upgrades/checks";
import { decrementEffects } from "./effects/effects";
import { decrementEffectsOnScreen, spawnEffect } from "./effects/onScreenEffects";
import { updateTimeSinceLastEffect } from "../redux/effectsSlice";
import { generateCollection } from "./collection/emojiCategories";
import { pickNextEmoji } from "./bigEmoji";
import { calculateEpt } from "./calculations";
import { canBuyUpgrade } from "./upgrades/checks";
import { addEmojisGained } from "../redux/statsSlice";
import { calculateBuildingsEps } from "./buildings/buildings";
import {
    calculateRemainingEmojisForNextPrestige,
    getPrestigeLevel,
} from "./prestige/prestige";
import { updateEmojiEssence } from "../redux/prestigeSlice";
import { decrementTapBoost } from "./tapBoost";

let lastUpdateTime = Date.now();
let tick = 0;
let loggedBigEmojiTaps = 0;

export function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdateTime) / 1000; // time in seconds since last update
    lastUpdateTime = now;

    // cache state once per frame
    const state = store.getState();

    giveEmojis(delta, state);

    // Runs once at game start
    if (tick === 0) {
        store.dispatch(updateTimeSinceLastEffect(0)); // reset timer
        generateCollection();
        pickNextEmoji();
        calculateEpt();
        calculateBuildingsEps();
        loggedBigEmojiTaps = state.stats.bigEmojiTaps;
    }

    // Every 2.5s (assuming loop runs at 100ms interval)
    if (tick % 25 === 0) {
        canBuyBuilding();
        unlockBuilding();
        canBuyUpgrade();

        // detect new tap
        if (loggedBigEmojiTaps !== state.stats.bigEmojiTaps) {
            loggedBigEmojiTaps = state.stats.bigEmojiTaps;
            unlockUpgrades();
        }

        store.dispatch(updateEmojiEssence(getPrestigeLevel()));
    }

    // Every 1s
    if (tick % 10 === 0) {
        store.dispatch(updateTimeSinceLastEffect(state.effects.timeSinceLastEffect + 1));
        decrementEffects();
        decrementEffectsOnScreen();
        spawnEffect();
        calculateRemainingEmojisForNextPrestige(true);
    }

    decrementTapBoost();

    tick++;
}

export function giveEmojis(delta: number, state = store.getState()) {
    const { emojisPerSecond, emojis } = state.values;
    const gained = emojisPerSecond * delta;

    store.dispatch(updateEmojis(emojis + gained));
    store.dispatch(addEmojisGained(gained));
}
