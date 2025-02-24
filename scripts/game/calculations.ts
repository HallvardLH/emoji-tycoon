import store from "../redux/reduxStore";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";
import { updateEmojisPerSecond } from "../redux/valuesSlice";
import { formatNumber } from "../misc";

// Recalculates emojis per tap
export function calculateEpt() {
    // Gets all active effects
    const allEffects = store.getState().effects.effects;
    // Extracts their tap multiplier to an array
    const activeEffects = allEffects.map(effect => effect.eptMult);

    // Gets multipliers from big emoji upgrades
    let tapMultipliers = store.getState().bigEmoji.emojisPerTapMultipliers;

    // Combine activeEffects and tapMultipliers into one array
    let combinedMultipliers = [...activeEffects, ...tapMultipliers];

    // Multiplies them all together
    let multiplier = combinedMultipliers
        .filter(mult => mult !== 0) // Removes 0
        .reduce((acc, mult) => acc * mult, 1);

    // Get the percentage increases
    let tapPercentageIncreases = store.getState().bigEmoji.emojisPerTapPercentages;

    // Compound the percentage increases (percentages are already in decimal form, e.g., 0.01 for 1%)
    let percentageIncrease = Math.floor(tapPercentageIncreases
        .filter(perc => perc !== 0)
        .reduce((acc, perc) => acc * (1 + perc), 1) * 10) / 10;

    // Gets epsPercentages, no compounding here
    const tapPercentageOfEps = store.getState().bigEmoji.emojisPerTapPercentageOfEps;
    const totalPercentageOfEps = tapPercentageOfEps.reduce((acc, perc) => acc + perc, 0);

    // Gets a certain percentage of your emojis per second (eps) and adds it to emojis per tap (ept)
    // This allows tapping to keep up with eps
    const eps = store.getState().values.emojisPerSecond;
    const epsBonus = eps * totalPercentageOfEps;

    // Gets base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;

    // Calculate emojis per tap with the total multiplier and compounded percentage increases
    let ept = ((baseEmojisPerTap + epsBonus) * multiplier) * percentageIncrease;

    // console.log(baseEmojisPerTap, eps, totalPercentageOfEps, epsBonus, multiplier, percentageIncrease, ept)

    // Dispatch the updated value to the store
    store.dispatch(updateEmojisPerTap(ept));
}

/**
 * Calculates and returns the bonus Emojis Per Tap from buying an upgrade
 *
 * Uses the same caluclation as @calculateEpt and adds the new values, provided as params
 *
 * @param newPercentageOfEps (optional) A percentage of the current Emojis Per Second, added to Emojis per tap.
 * @param newMultiplier (optional) Number by which emojis per tap is multiplied.
 * @param newPercentageIncrease (optional) Percentage of the full emojis per tap, added on top.
 */
export function calculateEptBonus(newPercentageOfEps?: number, newMultiplier?: number, newPercentageIncrease?: number) {
    // Gets all active effects
    const allEffects = store.getState().effects.effects;
    // Extracts their tap multiplier to an array
    const activeEffects = allEffects.map(effect => effect.eptMult);

    // Gets multipliers from big emoji upgrades
    let tapMultipliers = store.getState().bigEmoji.emojisPerTapMultipliers;

    // Combine activeEffects and tapMultipliers into one array
    let combinedMultipliers = [...activeEffects, ...tapMultipliers];
    // Adds the new bonus
    combinedMultipliers.push(newMultiplier ? newMultiplier : 0);

    // Multiplies them all together
    let multiplier = combinedMultipliers
        .filter(mult => mult !== 0) // Removes 0
        .reduce((acc, mult) => acc * mult, 1);

    // Get the percentage increases
    let tapPercentageIncreases = [...store.getState().bigEmoji.emojisPerTapPercentages];
    // Adds the new bonus
    tapPercentageIncreases.push(newPercentageIncrease ? newPercentageIncrease : 0);

    // Compound the percentage increases (percentages are already in decimal form, e.g., 0.01 for 1%)
    let percentageIncrease = tapPercentageIncreases
        .filter(perc => perc !== 0)
        .reduce((acc, perc) => acc * (1 + perc), 1);

    // Gets epsPercentages, no compounding here
    let tapPercentageOfEps = [...store.getState().bigEmoji.emojisPerTapPercentageOfEps];
    tapPercentageOfEps.push(newPercentageOfEps ? newPercentageOfEps : 0);
    const totalPercentageOfEps = tapPercentageOfEps.reduce((acc, perc) => acc + perc, 0);

    // Gets a certain percentage of your emojis per second (eps) and adds it to emojis per tap (ept)
    // This allows tapping to keep up with eps
    const eps = store.getState().values.emojisPerSecond;
    const epsBonus = eps * totalPercentageOfEps;

    // Gets base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;

    // Calculate emojis per tap with the total multiplier and compounded percentage increases
    let ept = ((baseEmojisPerTap + epsBonus) * multiplier) * percentageIncrease;

    const currentEpt = store.getState().bigEmoji.emojisPerTap;

    const bonus = ept - currentEpt;

    let bonusPercentage: number | string = (bonus / currentEpt) * 100;
    if (bonusPercentage < 0.01) {
        bonusPercentage = "(>0.01%)";
    } else {
        bonusPercentage = "(" + Math.round(bonusPercentage * 100) / 100 + "%)";
    }

    return { bonus: formatNumber(bonus), bonusPercentage: bonusPercentage }
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