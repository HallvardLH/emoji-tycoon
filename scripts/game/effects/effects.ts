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
        if (effect.timeLeft > 0) {
            store.dispatch(updateTimeLeft({ id: effect.instanceId!, timeLeft: effect.timeLeft - 1 }))
        }

        // If timeLeft has reached 0, remove the effect
        if (effect.timeLeft <= 0) {
            store.dispatch(removeEffect(effect.instanceId!));
            calculateEmojisPerSecond();
            calculateEpt();
        }
    })
}