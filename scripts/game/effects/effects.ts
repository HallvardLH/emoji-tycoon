import { store } from '../../redux/reduxStore';
import { updateEptMult, updateEptAdd } from '../../redux/bigEmojiSlice';
import { calculateEpt } from '../checks';
import { removeEffect, updateTimeLeft } from '../../redux/effectsSlice';
import { EffectTypes } from './createEffect';

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
            store.dispatch(updateTimeLeft({ id: effect.id!, timeLeft: effect.timeLeft - 1 }))
        }

        // If timeLeft has reached 0, remove the effect
        if (effect.timeLeft <= 0) {
            removeEffectValues(effect.type, effect.eptMult, effect.eptAdd)
            store.dispatch(removeEffect(effect.id!));
        }
    })
}

/**
 * Adds the values of a given effect
 *
 * Called when an effect emoji is tapped, and alters the intended values.
 * For example, "tap" effects alter either ept (emojis per tap) multiplier, addition or both
 *
 * @param type the type of effect.
 * @param eptMult the factor by which the emojis per tap is multiplied.
 * @param eptAdd the amount of emojis added to each tap.
 */
export function addEffectValues(type: EffectTypes, eptMult: number, eptAdd: number) {
    switch (type) {
        case "tap":
            store.dispatch(updateEptMult(store.getState().bigEmoji.eptMult + eptMult));
            store.dispatch(updateEptAdd(store.getState().bigEmoji.eptAdd + eptAdd));
            calculateEpt();
            break;

        default:
            console.error("No effect for type " + type);
    }
}

/**
 * Removes the values of a given effect
 *
 * Called when the duration of an effect runs out.
 * 
 * @param type the type of effect.
 * @param eptMult the multiplication factor to be removed from emojis per tap.
 * @param eptAdd the amount of emojis removed from each tap.
 */
export function removeEffectValues(type: EffectTypes, eptMult: number, eptAdd: number) {
    switch (type) {
        case "tap":
            store.dispatch(updateEptMult(store.getState().bigEmoji.eptMult - eptMult));
            store.dispatch(updateEptAdd(store.getState().bigEmoji.eptAdd - eptAdd));
            calculateEpt();
            break;

        default:
            console.error("No effect for type " + type);
    }
}