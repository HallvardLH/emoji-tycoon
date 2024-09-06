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

    let ept = (baseEmojisPerTap + emojisPerTapAdd) * Math.pow(2, emojisPerTapMultiplier)

    store.dispatch(updateEmojisPerTap(ept));
}