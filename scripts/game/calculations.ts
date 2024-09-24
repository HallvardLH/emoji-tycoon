import { store } from "../redux/reduxStore";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";
import { updateEmojisPerSecond } from "../redux/valuesSlice";
import { formatNumber } from "../misc";

// Recalculates emojis per tap
export function calculateEpt() {
    // Gets all active effects
    const allEffects = store.getState().effects.effects;
    // Extracts their tap multiplier to an array
    const activeEffects = allEffects.map(effect => effect.eptMult);

    // Gets multipliers from upgrades
    let tapMultipliers = store.getState().bigEmoji.emojisPerTapMultipliers;

    // Combine activeEffects and tapMultipliers into one array
    let combinedMultipliers = [...activeEffects, ...tapMultipliers];

    // Multiplies them all together
    let totalMultiplier = combinedMultipliers
        .filter(mult => mult !== 0) // Removes 0
        .reduce((acc, mult) => acc * mult, 1);

    // Get the percentage increases
    let tapPercentageIncreases = store.getState().bigEmoji.emojisPerTapPercentages;

    // Compound the percentage increases (assuming percentages are already in decimal form, e.g., 0.01 for 1%)
    let compoundedPercentageMultiplier = tapPercentageIncreases
        .filter(perc => perc !== 0)
        .reduce((acc, perc) => acc * (1 + perc), 1);

    // Gets epsPercentages
    const tapPercentageOfEps = store.getState().bigEmoji.emojisPerTapPercentageOfEps;
    // This would compound percentages
    // const totalPercentageOfEps = tapPercentageOfEps
    //     .filter(perc => perc !== 0)
    //     .reduce((acc, perc) => acc * (1 + perc), 1);
    const totalPercentageOfEps = tapPercentageOfEps.reduce((acc, perc) => acc + perc, 0);

    // Gets a certain percentage of emojis per second and adds it as a bonus
    // This allows tapping to keep up with eps
    const eps = store.getState().values.emojisPerSecond;
    const epsBonus = eps * totalPercentageOfEps;

    // Base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;

    // Calculate emojis per tap with the total multiplier and compounded percentage increases
    let ept = ((baseEmojisPerTap * totalMultiplier) + epsBonus) * compoundedPercentageMultiplier;

    // Dispatch the updated value to the store
    store.dispatch(updateEmojisPerTap(ept));
}


export function calculateEmojisPerSecond() {
    // Gets all active effects
    let allEffects = store.getState().effects.effects;
    // Extracts their production multiplier to an array
    let activeEffects = allEffects.map(effect => effect.epsMult);

    // Multiplies the multipliers
    let totalMultiplier = activeEffects
        .filter(mult => mult !== 0) // Removes 0
        .reduce((acc, mult) => acc * mult, 1);

    let emojisPerSecondPercentageIncreases = store.getState().values.emojisPerSecondPercentages;

    // Apply compound percentage increases
    let compoundedPercentageMultiplier = emojisPerSecondPercentageIncreases
        .filter(perc => perc !== 0)
        .reduce((acc, perc) => acc * (1 + perc), 1);

    const totalBuildingEps = store.getState().values.totalBuildingEps;

    // Apply total multiplier and compounded percentage increases
    let eps = (totalBuildingEps * totalMultiplier) * compoundedPercentageMultiplier;

    // Update the store with the new EPS
    store.dispatch(updateEmojisPerSecond(eps));
}




/**
 * Calculates and returns the bonus Emojis Per Second from buying an upgrade
 *
 * Uses the same caluclation as @calculateEmojisPersecond and adds the new values, provided as params
 *
 * @param newMultiplierEffect (optional) the multiplier effect.
 * @param newPercentageIncrease (optional) the percentage increase.
 */
export function calculateEpsBonus(newMultiplierEffect?: number, newPercentageIncrease?: number) {
    // Gets all active effects
    let allEffects = store.getState().effects.effects;
    // Extracts their production multiplier to an array
    let activeEffects = allEffects.map(effect => effect.epsMult);
    activeEffects.push(newMultiplierEffect ? newMultiplierEffect : 0);
    // Multiplies the multipliers
    let totalMultiplier = activeEffects
        // Removes 0
        .filter(mult => mult !== 0)
        .reduce((acc, mult) => acc * mult, 1);

    let emojisPerSecondPercentageIncreases = [...store.getState().values.emojisPerSecondPercentages];

    emojisPerSecondPercentageIncreases.push(newPercentageIncrease ? newPercentageIncrease : 0)
    // Apply compound percentage increases
    let compoundedPercentageMultiplier = emojisPerSecondPercentageIncreases
        .filter(perc => perc !== 0)
        .reduce((acc, perc) => acc * (1 + perc), 1);

    const totalBuildingEps = store.getState().values.totalBuildingEps;

    const eps = (totalBuildingEps * totalMultiplier) * compoundedPercentageMultiplier;
    const currentEps = store.getState().values.emojisPerSecond;

    const bonus = eps - currentEps;

    let bonusPercentage: number | string = (bonus / currentEps) * 100;
    if (bonusPercentage < 0.01) {
        bonusPercentage = "(>0.01%)";
    } else {
        bonusPercentage = "(" + Math.round(bonusPercentage * 100) / 100 + "%)";
    }

    return { bonus: formatNumber(bonus), bonusPercentage: bonusPercentage }
}