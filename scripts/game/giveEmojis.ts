import store from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { addEmojisGained } from '../redux/statsSlice';

/**
 * Gives emojis upon tapping a "give emoji" effect emoji
 *
 * Gives either an hour's worth of eps or 25% of emojis in bank, whichever is smaller
 *
 */
export function emojiGiveEffect() {
    const emojisPerSecond = store.getState().values.emojisPerSecond;
    const emojis = store.getState().values.emojis;

    let gift = Math.min(emojisPerSecond * (60 * 60), emojis * 0.25);

    // Adds another random amount of emojis, just to be sure something is given
    gift += Math.floor(Math.random() * 1000);

    giveOneOffEmojis(gift);
}

/**
 * Instantly gives emojis to bank
 *
 * @param amount the amount of emojis that is given
 */
export function giveOneOffEmojis(amount: number) {
    const emojis = store.getState().values.emojis;
    store.dispatch(updateEmojis(emojis + amount));
    store.dispatch(addEmojisGained(amount));
}