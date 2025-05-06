import store from "../redux/reduxStore";
import { updateTapBoost } from "../redux/bigEmojiSlice";
import { calculateEpt } from "./calculations";

export function decrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    if (tapBoost == 0) return
    // The amount by which the boost is decremented every 100ms
    // The amount was obtained simply through testing different values,
    // and has no specific reasoning behind it, other than
    // making it moderately hard to increase the tap boost
    const boostDecrement = 0.7
    if (tapBoost - boostDecrement > 0) {
        store.dispatch(updateTapBoost(tapBoost - boostDecrement));
    } else {
        store.dispatch(updateTapBoost(0));
    }
    calculateEpt();
}

export function incrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;

    store.dispatch(updateTapBoost(tapBoost + 1));
}