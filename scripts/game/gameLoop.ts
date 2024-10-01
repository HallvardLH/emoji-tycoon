import { updateEmojis } from "../redux/valuesSlice";
import { store } from '../redux/reduxStore';
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

let lastUpdateTime = Date.now();
let i = 0
let loggedBigEmojiTaps = 0;
export function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdateTime) / 1000; // time in seconds since last update
    lastUpdateTime = now;

    giveEmojis(delta);

    // Runs at the start of a game session
    if (i == 0) {
        // Resets the effect timer, so an effect emoji doesn't spawn immediately on load
        store.dispatch(updateTimeSinceLastEffect(0));

        generateCollection();

        pickNextEmoji();

        calculateEpt();

        calculateBuildingsEps();

        loggedBigEmojiTaps = store.getState().stats.bigEmojiTaps;
    }

    // Runs once every 2.5 seconds
    if (i % 25 == 0) {
        canBuyBuilding();
        unlockBuilding();
        canBuyUpgrade();
        // If big emoji taps are not the same as the logged value, we know the emoji has been tapped
        if (loggedBigEmojiTaps != store.getState().stats.bigEmojiTaps) {
            loggedBigEmojiTaps = store.getState().stats.bigEmojiTaps;
            unlockUpgrades();
        }
    }
    // Runs once every second
    if (i % 10 == 0) {
        store.dispatch(updateTimeSinceLastEffect(store.getState().effects.timeSinceLastEffect + 1));
        decrementEffects();
        decrementEffectsOnScreen();
        spawnEffect();
    }
    i++
}

export function giveEmojis(delta: number) {
    const emojisPerSecond = store.getState().values.emojisPerSecond;
    const emojis = store.getState().values.emojis;

    store.dispatch(updateEmojis(emojis + emojisPerSecond * delta));
    store.dispatch(addEmojisGained(emojisPerSecond * delta));
}