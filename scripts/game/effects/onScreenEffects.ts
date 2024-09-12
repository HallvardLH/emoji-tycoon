import { store } from '../../redux/reduxStore';
import { addEffectOnScreen, removeEffectOnScreen, addEffect, updateTimeSinceLastEffect, updateTimeLeftOnScreen } from '../../redux/effectsSlice';
import { createEffect } from './createEffect';
import { calculateEmojisPerSecond, calculateEpt } from '../calculations';

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
    const newEffect = effectsOnScreen.find(effect => effect.id === id)!;
    store.dispatch(addEffect(newEffect!));

    // Removes the effect from the onScreen array
    store.dispatch(removeEffectOnScreen(id));

    calculateEmojisPerSecond();
    calculateEpt();

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
            store.dispatch(updateTimeLeftOnScreen({ id: effect.id!, timeLeftOnScreen: effect.timeLeftOnScreen - 1 }))
        }

        // If timeLeft has reached 0, remove the effect
        if (effect.timeLeftOnScreen <= 0) {
            store.dispatch(removeEffectOnScreen(effect.id!));
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
    if (timeSinceLastEffect >= 0) {
        // Increasing chance each second, with a guaranteed spawn at 150 seconds
        const chance = timeSinceLastEffect / 100 - Math.random();
        const threshold = 0.5;
        if (chance > threshold || guaranteed) {
            store.dispatch(addEffectOnScreen(createEffect()));
            store.dispatch(updateTimeSinceLastEffect(0));
        }
    }
}