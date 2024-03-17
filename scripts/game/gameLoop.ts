import { updateEmojis } from "../redux/valuesSlice";
import { store } from '../redux/reduxStore';

let lastUpdateTime = Date.now();
export function gameLoop() {
    const now = Date.now();
    const delta = (now - lastUpdateTime) / 1000; // time in seconds since last update
    lastUpdateTime = now;

    giveEmojis(delta);
}

export function giveEmojis(delta: number) {
    const eps = store.getState().values.eps;
    const emojis = store.getState().values.emojis;
    store.dispatch(updateEmojis(emojis + eps * delta))
}