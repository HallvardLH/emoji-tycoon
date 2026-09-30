import store from "../redux/reduxStore";
import { updateTapBoost } from "../redux/bigEmojiSlice";
import { calculateEpt } from "./calculations";

// Every tap adds 1 boost, and every 10 boost adds ×1 to emojis per tap (see calculateEpt)
export const BOOST_PER_MULTIPLIER = 10;
// The combo tops out at ×5
export const MAX_COMBO_MULTIPLIER = 5;
const MAX_TAP_BOOST = BOOST_PER_MULTIPLIER * MAX_COMBO_MULTIPLIER - 0.01;

// The amount by which the boost is decremented every 100ms (3.5 per second).
// Tapping faster than ~3.5 times per second builds the combo, e.g. at 6 taps
// per second it reaches ×2 in about 4 seconds and ×5 in about 16.
// Stop tapping and it drains in a few seconds.
const BOOST_DECREMENT = 0.35;

export function decrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    if (tapBoost == 0) return
    store.dispatch(updateTapBoost(Math.max(0, tapBoost - BOOST_DECREMENT)));
    calculateEpt();
}

export function incrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;

    store.dispatch(updateTapBoost(Math.min(MAX_TAP_BOOST, tapBoost + 1)));
}

/**
 * The current combo multiplier and how full its stage is (0 - 1).
 * At max, progress is how much boost is banked above the ×5 threshold,
 * so the meter fills up to the cap and visibly drains back down.
 */
export function getComboProgress(tapBoost: number) {
    const multiplier = Math.floor(tapBoost / BOOST_PER_MULTIPLIER) + 1;
    const isMax = multiplier >= MAX_COMBO_MULTIPLIER;
    const progress = (tapBoost % BOOST_PER_MULTIPLIER) / BOOST_PER_MULTIPLIER;
    return { multiplier, progress, isMax };
}
