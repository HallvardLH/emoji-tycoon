import { updateEmojis } from "../redux/valuesSlice";
import { store } from '../redux/reduxStore';
import { canBuyBuilding } from "./buildings";
import { unlockUpgrades } from "./checks";

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
        // unlockUpgrades();
    }
    i++
}

export function giveEmojis(delta: number) {
    const eps = store.getState().values.eps;
    const emojis = store.getState().values.emojis;
    store.dispatch(updateEmojis(emojis + eps * delta))
}