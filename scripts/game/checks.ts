import { store } from "../redux/reduxStore";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";

// Recalculates emojis per tap
export function calculateEpt() {
    // Base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;
    // Adds emojis to base per tap
    const emojisPerTapAdd = store.getState().bigEmoji.eptAdd;
    // Multiplies emojis per tap
    let emojisPerTapMultiplier = store.getState().bigEmoji.eptMult;
    if (emojisPerTapMultiplier == 0) { emojisPerTapMultiplier = 1 }

    let ept = (baseEmojisPerTap + emojisPerTapAdd) * emojisPerTapMultiplier

    store.dispatch(updateEmojisPerTap(ept));
}