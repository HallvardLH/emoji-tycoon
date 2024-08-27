import { updateEmojis } from "../redux/valuesSlice";
import { store } from '../redux/reduxStore';
import { canBuyBuilding, unlockBuilding } from "./buildings/checks";
import { unlockUpgrades, } from "./checks";
import { decrementEffects } from "./effects/effects";
import { decrementEffectsOnScreen, spawnEffect } from "./effects/onScreenEffects";
import { updateTimeSinceLastEffect } from "../redux/effectsSlice";

let lastUpdateTime = Date.now();
let i = 0
export function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdateTime) / 1000; // time in seconds since last update
    lastUpdateTime = now;

    giveEmojis(delta);

    // Runs once every 2.5 seconds
    if (i % 25 == 0) {
        canBuyBuilding();
        unlockBuilding();
        // unlockUpgrades();
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
    const eps = store.getState().values.eps;
    const emojis = store.getState().values.emojis;
    store.dispatch(updateEmojis(emojis + eps * delta))
}