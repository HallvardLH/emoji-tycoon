import store from '../../redux/reduxStore';
import { addEffectOnScreen, removeEffectOnScreen, addEffect, updateTimeSinceLastEffect, updateTimeLeftOnScreen } from '../../redux/effectsSlice';
import { createEffect } from './createEffect';
import { Effect } from './effectType';
import { calculateEmojisPerSecond, calculateEpt } from '../calculations';
import { howFun } from '../shorthands';
import { addEffectEmojisCollected } from '../../redux/statsSlice';
import { emojiGiveEffect } from '../giveEmojis';
import * as Haptics from "expo-haptics"
import { vibrateForDuration } from '../../utils';
import { playHaptic } from '../../utils';
import { effectSpawnRateMultiplier } from '../prestige/perks';
import { canSpawnEffects } from '../prestige/trials';
import { effectUpgradeSpawnMultiplier, hasEffectEmojis } from './effectUpgrades';

/**
 * Called when the player taps an effect emoji
 *
 * Removes the effect emoji from the screen, and adds it to the array of currently active effects.
 * 
 * @param effect is the effect emoji that was tapped. It may have just run out and left
 * the onScreen array, as effects can still be tapped while they fade away.
 * @returns the amount of emojis given, for "give" effects
 */
export function tapEffect(effect: Effect): number | undefined {
    const id = effect.instanceId!;
    const effectsOnScreen = store.getState().effects.effectsOnScreen;

    // The stored effect if it's still on screen, else the one that was shown as it faded
    const newEffect = effectsOnScreen.find(effect => effect.instanceId === id) ?? effect;
    store.dispatch(addEffect(newEffect));

    // Removes the effect from the onScreen array
    store.dispatch(removeEffectOnScreen(id));

    let given: number | undefined;
    if (newEffect.type === "give") {
        given = emojiGiveEffect();
    }

    calculateEmojisPerSecond();
    calculateEpt();

    // Add to stats
    store.dispatch(addEffectEmojisCollected(1));

    // vibrateForDuration(5000)
    playHaptic("boost");

    return given;
}

/**
 * Decrements the timer on all effects on screen
 *
 * Is called every second from the gameLoop.
 *
 */
export function decrementEffectsOnScreen() {
    const effectsOnScreen = store.getState().effects.effectsOnScreen;
    effectsOnScreen.forEach(effect => {
        if (effect.timeLeftOnScreen > 0) {
            store.dispatch(updateTimeLeftOnScreen({ id: effect.instanceId!, timeLeftOnScreen: effect.timeLeftOnScreen - 1 }))
        }

        // If timeLeft has reached 0, remove the effect
        if (effect.timeLeftOnScreen <= 0) {
            store.dispatch(removeEffectOnScreen(effect.instanceId!));
        }
    })
}

/**
 * Spawns an exact number of effect emojis at once (used by the cheat menu)
 */
export function spawnEffects(count: number) {
    for (let i = 0; i < count; i++) {
        store.dispatch(addEffectOnScreen(createEffect()));
    }
    store.dispatch(updateTimeSinceLastEffect(0));
}

/**
 * Attempts to spawn an effect emoji
 *
 * Based on the time since last effect was spawned, a random check is done each second,
 * where time since last effect / 200 - a random number between 0 and 1 is put against 0.5.
 * This generally spawns an effect every two minutes or so (never before 100 seconds),
 * with a max wait period of 300 seconds.
 * 
 * @param guaranteed can be passed to bypass the chance check.
 */
export function spawnEffect(guaranteed?: boolean) {
    // Dark sky (trial): no effect emojis. Nor before Good vibes (upgrade) is bought
    if (!canSpawnEffects() || !hasEffectEmojis()) return;
    const timeSinceLastEffect = store.getState().effects.timeSinceLastEffect;
    const spawnChanceIncreases = store.getState().effects.effectSpawnChanceIncreasers;
    const spawnChanceIncrease = spawnChanceIncreases.reduce((acc, val) => acc + val)
    if (timeSinceLastEffect >= 0) {
        // Increasing chance each second, with a guaranteed spawn at 300 seconds
        // Lucky streak (perk) and Lucky stars / Shooting stars (upgrades) make time count for more
        const chance = timeSinceLastEffect * effectSpawnRateMultiplier() * effectUpgradeSpawnMultiplier() / 200 - Math.random();
        // Threshold of 0.5 means at least 100 seconds must have passed for there to
        // even be a chance at all of something spawning
        // With a fun value of 70 to 75, the threshold is lowered by 0.2,
        // making boost emojis spawn sooner
        let threshold = 0.5 - (howFun(70, 75) ? 0.2 : 0);
        if (chance >= threshold / spawnChanceIncrease || guaranteed) {
            store.dispatch(addEffectOnScreen(createEffect()));
            // Lucky! 1% chance of 2 effect spawning
            if (Math.random() > 0.99) {
                store.dispatch(addEffectOnScreen(createEffect()));
            }
            // Lucky you! Another effect spawned, with a 10% chance
            // but only if your fun value is 76
            if (howFun(76) && Math.random() > 0.9) {
                store.dispatch(addEffectOnScreen(createEffect()));
            }
            store.dispatch(updateTimeSinceLastEffect(0));
        }
    }
}