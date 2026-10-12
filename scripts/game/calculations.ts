import store from "../redux/reduxStore";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";
import { updateEmojisPerSecond } from "../redux/valuesSlice";
import { funProductionMultiplier, funTapMultiplier } from "./shorthands";
import { prestigeProductionMultiplier } from "./prestige/perks";
import { trialTapMultiplier } from "./prestige/trials";

const multiplyAll = (mults: number[]) => mults
    .filter(mult => mult !== 0) // Removes 0
    .reduce((acc, mult) => acc * mult, 1);

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
    tapPercentages: number[];
    tapPercentagesOfEps: number[];
    /** Emojis per second, for the share of production that hands add to taps */
    eps: number;
}

/** Emojis per tap, from the game as it is now, with any inputs swapped in */
function computeEpt(inputs: Partial<TapInputs> = {}) {
    const state = store.getState();
    const { bigEmoji } = state;

    // Tap multipliers from upgrades and active effects
    const multiplier = multiplyAll([
        ...state.effects.effects.map(effect => effect.eptMult),
        ...(inputs.tapMultipliers ?? bigEmoji.emojisPerTapMultipliers),
    ]);

    // Rounded down to the nearest 10%
    const percentageIncrease = Math.floor(compound(inputs.tapPercentages ?? bigEmoji.emojisPerTapPercentages) * 10) / 10;

    // A share of emojis per second (eps) is added to emojis per tap (ept), so tapping keeps up with production.
    // Shares add up, no compounding here
    const totalPercentageOfEps = (inputs.tapPercentagesOfEps ?? bigEmoji.emojisPerTapPercentageOfEps)
        .reduce((acc, perc) => acc + perc, 0);
    const epsBonus = (inputs.eps ?? state.values.emojisPerSecond) * totalPercentageOfEps;

    // For every 10 tap boost, multiply EPT
    const tapBoost = (Math.floor(bigEmoji.tapBoost / 10)) + 1;

    // The base tap plus the share of production ("hands"), all multiplied: tap multipliers,
    // percentage increases and the combo. (Tap multipliers used to boost only the base tap,
    // which made "Tapping ×2" add next to nothing once hands carried tapping.)
    // Trials: Hands off makes taps worth nothing, Bare bones (reward) adds 50%
    return (bigEmoji.baseEmojisPerTap + epsBonus) * multiplier * percentageIncrease * tapBoost * funTapMultiplier() * trialTapMultiplier();
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

/** Production multiplier from active effects */
const effectProductionMultiplier = () => multiplyAll(store.getState().effects.effects.map(effect => effect.epsMult));

export function calculateEmojisPerSecond() {
    store.dispatch(updateEmojisPerSecond(computeBaseEps() * effectProductionMultiplier()));
}

/**
 * Emojis per second without effects. Offline earnings use it, as effects run out while away.
 */
export function calculateBaseEmojisPerSecond() {
    return computeBaseEps();
}

/** What an upgrade changes, for previewing it */
export interface UpgradeChanges {
    /** Production added to the buildings' combined total, before multipliers */
    buildingEps?: number;
    epsPercentage?: number;
    tapMultiplier?: number;
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
export function previewUpgradeGains(changes: UpgradeChanges) {
    const { values, bigEmoji } = store.getState();
    const add = (list: number[], value?: number) => value ? [...list, value] : list;

    const eps = computeBaseEps({
        totalBuildingEps: values.totalBuildingEps + (changes.buildingEps ?? 0),
        epsPercentages: add(values.emojisPerSecondPercentages, changes.epsPercentage),
    }) * effectProductionMultiplier();

    const ept = computeEpt({
        eps,
        tapMultipliers: add(bigEmoji.emojisPerTapMultipliers, changes.tapMultiplier),
        tapPercentages: add(bigEmoji.emojisPerTapPercentages, changes.tapPercentage),
        tapPercentagesOfEps: add(bigEmoji.emojisPerTapPercentageOfEps, changes.tapPercentageOfEps),
    });

    return {
        eps: eps - values.emojisPerSecond,
        ept: ept - bigEmoji.emojisPerTap,
    };
}

/** A gain as a share of the current value, e.g. "2.5%" or ">0.01%" */
export function formatGainPercentage(gain: number, current: number) {
    const percentage = current > 0 ? (gain / current) * 100 : 0;
    return percentage < 0.01 ? ">0.01%" : Math.round(percentage * 100) / 100 + "%";
}
