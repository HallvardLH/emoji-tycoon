import store from '../../redux/reduxStore';
import { removeEffect, updateTimeLeft } from '../../redux/effectsSlice';
import { calculateEpt, calculateEmojisPerSecond } from '../calculations';

/**
 * Decrements the timer on all active effects
 *
 * Is called every second from the gameLoop
 *
 */
export function decrementEffects() {
    const effects = store.getState().effects.effects;

    effects.forEach(effect => {
        const timeLeft = effect.timeLeft - 1;

        // Remove the effect as soon as it runs out, so it never lingers at 0 seconds
        if (timeLeft <= 0) {
            store.dispatch(removeEffect(effect.instanceId!));
            calculateEmojisPerSecond();
            calculateEpt();
        } else {
            store.dispatch(updateTimeLeft({ id: effect.instanceId!, timeLeft }))
        }
    })
}