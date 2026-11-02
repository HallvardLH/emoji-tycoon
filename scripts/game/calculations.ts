import store from "../redux/reduxStore";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";
import { updateEmojisPerSecond } from "../redux/valuesSlice";
import { funProductionMultiplier, funTapMultiplier } from "./shorthands";
import { prestigeProductionMultiplier, prestigeTapMultiplier } from "./prestige/perks";
import { trialTapMultiplier } from "./prestige/trials";
import { formatPercentage } from "../misc";
import { boostMultiplier } from "./gems/boost";
import { combinedEffectMultiplier } from "./effects/effectStacking";

const multiplyAll = (mults: number[]) => mults
    .filter(mult => mult !== 0) // Removes 0
    .reduce((acc, mult) => acc * mult, 1);

/** Adds percentage increases up (in decimal form, e.g. 0.1 for 10%): ten +10% make ×2, not ×2.59 */
const addUp = (percentages: number[]) => percentages.reduce((acc, perc) => acc + perc, 1);

// Compound the percentage increases (percentages are already in decimal form, e.g., 0.01 for 1%)
const compound = (percentages: number[]) => percentages
    .filter(perc => perc !== 0)
    .reduce((acc, perc) => acc * (1 + perc), 1);

/**
 * What emojis per tap is calculated from. Previews of an upgrade pass these with the
 * upgrade added; anything left out is taken from the game as it is now.
 */
interface TapInputs {
    tapMultipliers: number[];
    tapAdditions: number[];
    tapPercentages: number[];
    tapPercentagesOfEps: number[];
    /** Emojis per second, for the share of production that hands add to taps */
    eps: number;
}

/** Emojis per tap, from the game as it is now, with any inputs swapped in */
function computeEpt(inputs: Partial<TapInputs> = {}) {
    const state = store.getState();
    const { bigEmoji } = state;

    // Tap multipliers from upgrades, active effects (the same kind adds up) and the gem boost
    const multiplier = combinedEffectMultiplier(state.effects.effects, "eptMult") * multiplyAll([
        boostMultiplier(),
        ...(inputs.tapMultipliers ?? bigEmoji.emojisPerTapMultipliers),
    ]);

    // The helpers' tapping bonuses add up rather than compound. Rounded down to the nearest 1%;
    // the small epsilon keeps 1 + 0.02 × 3 from landing a hair under 1.06
    const percentageIncrease = Math.floor(addUp(inputs.tapPercentages ?? bigEmoji.emojisPerTapPercentages) * 100 + 1e-9) / 100;

    // A share of emojis per second (eps) is added to emojis per tap (ept), so tapping keeps up with production.
    // Shares add up, no compounding here
    const totalPercentageOfEps = (inputs.tapPercentagesOfEps ?? bigEmoji.emojisPerTapPercentageOfEps)
        .reduce((acc, perc) => acc + perc, 0);
    // Production without the gem boost: it's in the multiplier above, and would count twice
    const epsBonus = (inputs.eps ?? state.values.emojisPerSecond) / boostMultiplier() * totalPercentageOfEps;

    // Flat emojis added to the base tap, e.g. Firm tap (+1)
    const baseTap = bigEmoji.baseEmojisPerTap + (inputs.tapAdditions ?? bigEmoji.emojisPerTapAdditions ?? []).reduce((acc, add) => acc + add, 0);

    // For every 10 tap boost, multiply EPT
    const tapBoost = (Math.floor(bigEmoji.tapBoost / 10)) + 1;

    // The base tap (with the flat additions) plus the share of production ("hands"), all multiplied: tap multipliers,
    // percentage increases and the combo. (Tap multipliers used to boost only the base tap,
    // which made "Tapping ×2" add next to nothing once hands carried tapping.)
    // Trials: Hands off makes taps worth nothing, Bare bones (reward) adds 50%. Echo (perk) and traits
    return (baseTap + epsBonus) * multiplier * percentageIncrease * tapBoost * funTapMultiplier() * trialTapMultiplier() * prestigeTapMultiplier();
}

// Recalculates emojis per tap
export function calculateEpt() {
    store.dispatch(updateEmojisPerTap(computeEpt()));
}

/** What emojis per second is calculated from; previews swap these like TapInputs */
interface ProductionInputs {
    /** All buildings' production combined, before any multipliers */
    totalBuildingEps: number;
    epsPercentages: number[];
}

/** Emojis per second without effects, from the game as it is now, with any inputs swapped in */
function computeBaseEps(inputs: Partial<ProductionInputs> = {}) {
    const { values } = store.getState();
    // Compounded percentage increases, any fun value bonus,
    // and emoji essence (unspent essence and production perks)
    return (inputs.totalBuildingEps ?? values.totalBuildingEps)
        * compound(inputs.epsPercentages ?? values.emojisPerSecondPercentages)
        * funProductionMultiplier()
        * prestigeProductionMultiplier();
}

/** Production multiplier from active effects and the gem boost */
const effectProductionMultiplier = () => combinedEffectMultiplier(store.getState().effects.effects, "epsMult") * boostMultiplier();

export function calculateEmojisPerSecond() {
    store.dispatch(updateEmojisPerSecond(computeBaseEps() * effectProductionMultiplier()));
}

/**
 * Emojis per second without effects or the gem boost. Offline earnings use it, as
 * effects run out while away (the boost is added for the part of the time it was on).
 */
export function calculateBaseEmojisPerSecond() {
    return computeBaseEps();
}

/** What an upgrade or more buildings change, for previewing it */
export interface ProductionChanges {
    /** Production added to the buildings' combined total, before multipliers */
    buildingEps?: number;
    /** Multiplies all production on top, e.g. Neighbourhood (perk) when buying a new kind of building */
    productionFactor?: number;
    epsPercentage?: number;
    tapMultiplier?: number;
    tapAddition?: number;
    tapPercentage?: number;
    tapPercentageOfEps?: number;
}

/**
 * How much emojis per second and per tap would go up with these changes, right now
 *
 * Runs the same calculations as the game, so it includes everything they do: more
 * production also makes taps worth more through the hands, and effects and the combo
 * count as they are at the moment.
 */
export function previewGains(changes: ProductionChanges) {
    const { values, bigEmoji } = store.getState();
    const add = (list: number[], value?: number) => value ? [...list, value] : list;

    const eps = computeBaseEps({
        totalBuildingEps: values.totalBuildingEps + (changes.buildingEps ?? 0),
        epsPercentages: add(values.emojisPerSecondPercentages, changes.epsPercentage),
    }) * effectProductionMultiplier() * (changes.productionFactor ?? 1);

    const ept = computeEpt({
        eps,
        tapMultipliers: add(bigEmoji.emojisPerTapMultipliers, changes.tapMultiplier),
        tapAdditions: add(bigEmoji.emojisPerTapAdditions ?? [], changes.tapAddition),
        tapPercentages: add(bigEmoji.emojisPerTapPercentages, changes.tapPercentage),
        tapPercentagesOfEps: add(bigEmoji.emojisPerTapPercentageOfEps, changes.tapPercentageOfEps),
    });

    return {
        eps: eps - values.emojisPerSecond,
        ept: ept - bigEmoji.emojisPerTap,
    };
}

/** A gain as a share of the current value, e.g. "2.5%" or "<0.01%", in the current language */
export function formatGainPercentage(gain: number, current: number) {
    return formatPercentage(current > 0 ? (gain / current) * 100 : 0);
}
