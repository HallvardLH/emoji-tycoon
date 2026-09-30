import store from "../redux/reduxStore";
import { updateTapBoost } from "../redux/bigEmojiSlice";
import { calculateEpt } from "./calculations";
import { howFun } from "./shorthands";

// Every tap adds 1 boost, and every 10 boost adds ×1 to emojis per tap (see calculateEpt)
export const BOOST_PER_MULTIPLIER = 10;

/** The combo tops out at ×5, or ×6 with a fun value of 64 (overclocked) */
export function getMaxComboMultiplier() {
    return howFun(64) ? 6 : 5;
}

// The amount by which the boost is decremented every 100ms (3.5 per second).
// Tapping faster than ~3.5 times per second builds the combo, e.g. at 6 taps
// per second it reaches ×2 in about 4 seconds and ×5 in about 16.
// Stop tapping and it drains in a few seconds.
// With a fun value of 88 - 90 (marathon), it drains 25% slower.
const BOOST_DECREMENT = 0.35;

export function decrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    if (tapBoost == 0) return
    const decrement = BOOST_DECREMENT * (howFun(88, 90) ? 0.75 : 1);
    store.dispatch(updateTapBoost(Math.max(0, tapBoost - decrement)));
    calculateEpt();
}

export function incrementTapBoost() {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    const maxTapBoost = BOOST_PER_MULTIPLIER * getMaxComboMultiplier() - 0.01;

    store.dispatch(updateTapBoost(Math.min(maxTapBoost, tapBoost + 1)));
}

/**
 * The current combo multiplier and how full its stage is (0 - 1).
 * At max, progress is how much boost is banked above the max threshold,
 * so the meter fills up to the cap and visibly drains back down.
 */
export function getComboProgress(tapBoost: number) {
    const multiplier = Math.floor(tapBoost / BOOST_PER_MULTIPLIER) + 1;
    const isMax = multiplier >= getMaxComboMultiplier();
    const progress = (tapBoost % BOOST_PER_MULTIPLIER) / BOOST_PER_MULTIPLIER;
    return { multiplier, progress, isMax };
}
