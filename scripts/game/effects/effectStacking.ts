import type { Effect } from "./effectType";

/**
 * How active effects combine
 *
 * Effects of the same kind (the same effectData id) add up rather than multiply:
 * two ×3 tapping effects make ×5, not ×9. Multiplying let a few of the same boost
 * (an effect shower, or lucky spawns) stack into a tap worth hours of production.
 * Bad effects (under ×1) still multiply, so two ×0.5 make ×0.25 rather than nothing.
 * Different kinds multiply each other, so ×2 and ×3 tapping together still make ×6.
 */

/** One kind's combined multiplier, from its effects' multipliers (0 means "not this type") */
export function stackMultiplier(multipliers: number[]) {
    return multipliers
        .filter(mult => mult !== 0)
        .reduce((total, mult) => mult >= 1 ? total + (mult - 1) : total * mult, 1);
}

/** All active effects' combined multiplier for taps or production */
export function combinedEffectMultiplier(effects: Effect[], key: "eptMult" | "epsMult") {
    const byKind = new Map<number, number[]>();
    effects.forEach(effect => byKind.set(effect.id, [...(byKind.get(effect.id) ?? []), effect[key]]));
    return [...byKind.values()].reduce((total, multipliers) => total * stackMultiplier(multipliers), 1);
}
