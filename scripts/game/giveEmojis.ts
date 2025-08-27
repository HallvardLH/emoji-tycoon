import store from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { addEmojisGained } from '../redux/statsSlice';

/**
 * Gives emojis upon tapping a "give emoji" effect emoji.
 *
 * - Amount is the smaller of:
 *   - 1 hour's worth of EPS
 *   - 25% of current bank
 * - Always gives at least a small random bonus.
 */
export function emojiGiveEffect() {
    const { emojisPerSecond, emojis } = store.getState().values;

    // calculate best gift
    let gift = Math.min(emojisPerSecond * (60 * 60), emojis * 0.25);

    // Adds another random amount of emojis, just to be sure something is given
    const bonus = Math.floor(Math.random() * 1000);

    giveOneOffEmojis(gift + bonus);
}

/**
 * Instantly gives emojis to bank
 *
 * @param amount the amount of emojis that is given
 */
export function giveOneOffEmojis(amount: number) {
    // Disallow negatives or zero
    if (amount <= 0) return;

    const { emojis } = store.getState().values;
    const newTotal = emojis + amount;

    store.dispatch(updateEmojis(newTotal));
    store.dispatch(addEmojisGained(amount));
}