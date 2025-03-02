import store from "../redux/reduxStore";
import { updateTapBoost } from "../redux/bigEmojiSlice";
import { calculateEpt } from "./calculations";

export function decrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    if (tapBoost == 0) return
    if (tapBoost - 0.7 > 0) {
        store.dispatch(updateTapBoost(tapBoost - 0.7));
    } else {
        store.dispatch(updateTapBoost(0));
    }
    calculateEpt();
    console.log(store.getState().bigEmoji.tapBoost)
}

export function incrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;

    store.dispatch(updateTapBoost(tapBoost + 1));
}