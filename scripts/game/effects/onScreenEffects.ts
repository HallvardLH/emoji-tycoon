import store from '../../redux/reduxStore';
import { addEffectOnScreen, removeEffectOnScreen, addEffect, updateTimeSinceLastEffect, updateTimeLeftOnScreen } from '../../redux/effectsSlice';
import { createEffect } from './createEffect';
import { calculateEmojisPerSecond, calculateEpt } from '../calculations';
import { howFun } from '../shorthands';
import { addEffectEmojisCollected } from '../../redux/statsSlice';

/**
 * Called when the player taps an effect emoji
 *
 * Removes the effect emoji from the screen, and adds it to the array of currently active effects.
 * 
 * @param id is the id of the emoji that was tapped.
 */
export function tapEffect(id: number) {
    const effectsOnScreen = store.getState().effects.effectsOnScreen;

    // Finds the effect based on id and adds it to the effects array
    const newEffect = effectsOnScreen.find(effect => effect.instanceId === id)!;
    store.dispatch(addEffect(newEffect!));

    // Removes the effect from the onScreen array
    store.dispatch(removeEffectOnScreen(id));

    calculateEmojisPerSecond();
    calculateEpt();

    // Add to stats
    store.dispatch(addEffectEmojisCollected(1));

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
 * Attempts to spawn an effect emoji
 *
 * Based on the time since last effect was given (tapped by the player), a random check is done,
 * where time since last effect / 100 - a random number between 0 and 1 is put against 0.5.
 * This generally spawns an effect once a minute, with a max wait period of 151 seconds.
 * 
 * @param guaranteed can be passed to bypass the chance check.
 */
export function spawnEffect(guaranteed?: boolean) {
    const timeSinceLastEffect = store.getState().effects.timeSinceLastEffect;
    const spawnChanceIncreases = store.getState().effects.effectSpawnChanceIncreasers;
    const spawnChanceIncrease = spawnChanceIncreases.reduce((acc, val) => acc + val)
    if (timeSinceLastEffect >= 0) {
        // Increasing chance each second, with a guaranteed spawn at 300 seconds
        const chance = timeSinceLastEffect / 100 - Math.random();
        // Threshold of 2 means at least 200 seconds must have passed for there to
        // even be a chance at all of something spawning
        let threshold = 2 - (howFun(70, 75) ? 0.2 : 0);
        // console.log(chance, threshold / spawnChanceIncrease)
        if (chance >= threshold / spawnChanceIncrease || guaranteed) {
            store.dispatch(addEffectOnScreen(createEffect()));
            // Lucky you! Like, really lucky
            if (howFun(76) && Math.random() > 0.9) {
                store.dispatch(addEffectOnScreen(createEffect()));
            }
            store.dispatch(updateTimeSinceLastEffect(0));
        }
    }
}