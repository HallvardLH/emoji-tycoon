import store from "../redux/reduxStore";
import { updateTapBoost } from "../redux/bigEmojiSlice";
import { calculateEpt } from "./calculations";
import { howFun } from "./shorthands";
import { comboDrainMultiplier, maxComboBonus } from "./prestige/perks";
import { comboLevelOfTier, isComboUpgradeId } from "./upgrades/upgradeData/nonBuilding/combo";
import { getUpgradeDataById } from "./upgrades/shorthands";

// Every tap adds 1 boost, and every 10 boost adds ×1 to emojis per tap (see calculateEpt)
export const BOOST_PER_MULTIPLIER = 10;

/**
 * How high the combo can go: ×1 (no combo) until Combo! is bought, then the highest
 * combo level upgrade owned (×3 up to ×8), +1 more with a fun value of 64 (overclocked),
 * and +1 with Second wind (perk)
 */
export function getMaxComboMultiplier() {
    const level = ownedComboLevel(store.getState().upgrades.owned);
    if (level === 0) return 1;
    return level + (howFun(64) ? 1 : 0) + maxComboBonus();
}

// The highest combo level owned, worked out again only when the owned list changes:
// it's read on every store update (the combo meter selects it) and every tap
let cachedOwned: number[] | undefined;
let cachedLevel = 0;
function ownedComboLevel(owned: number[]) {
    if (owned !== cachedOwned) {
        cachedOwned = owned;
        cachedLevel = owned
            .filter(isComboUpgradeId)
            .reduce((max, id) => Math.max(max, comboLevelOfTier(getUpgradeDataById(id)?.tier ?? 0)), 0);
    }
    return cachedLevel;
}

/** Whether the combo is on: Combo! (or any combo level upgrade) is owned */
export const hasCombo = () => ownedComboLevel(store.getState().upgrades.owned) > 0;

// The combo drains faster the higher it is: 2.5 boost per second at ×1, plus 1 per level.
// Each tap adds 1, so climbing past a level takes tapping faster than its drain:
// ×2 needs about 3 taps/s, ×3 about 4, ×4 about 5, ×5 about 6.
// At 6 taps/s ×5 takes ~30s, at 8 ~11s, at 10 ~7s.
// The combo settles at whatever level your tapping speed can hold, so max combo is
// a burst of fast tapping rather than something any steady tapper reaches eventually.
// With a fun value of 88 - 90 (marathon), it drains 25% slower.
const BASE_DRAIN_PER_SECOND = 2.5;
const EXTRA_DRAIN_PER_LEVEL = 1;

/**
 * Drains the combo
 *
 * @param seconds real time since the last drain (the game loop runs every ~100ms, later when lagging)
 */
export function decrementTapBoost(seconds = 0.1) {
    const tapBoost = store.getState().bigEmoji.tapBoost;
    if (tapBoost == 0) return
    const { multiplier } = getComboProgress(tapBoost);
    const drainPerSecond = BASE_DRAIN_PER_SECOND + EXTRA_DRAIN_PER_LEVEL * (multiplier - 1);
    const decrement = drainPerSecond * seconds * (howFun(88, 90) ? 0.75 : 1) * comboDrainMultiplier();
    store.dispatch(updateTapBoost(Math.max(0, tapBoost - decrement)));
    calculateEpt();
}

export function incrementTapBoost() {
    // No combo until Combo! is bought
    if (!hasCombo()) return;
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
