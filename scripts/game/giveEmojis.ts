import store from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { addEmojisGained } from '../redux/statsSlice';
import { giftMultiplier } from './prestige/perks';

const GIFT_SECONDS_OF_PRODUCTION = 15 * 60;
const GIFT_SHARE_OF_BANK = 0.1;

/**
 * Gives emojis upon tapping a "give emoji" effect emoji.
 *
 * - Amount is the smaller of:
 *   - 15 minutes' worth of EPS
 *   - 10% of current bank
 * - Always gives at least a small random bonus.
 *
 * (Gifts used to be an hour or 25% of the bank, which made them most of a
 * non-tapping player's income and let a saved-up bank compound.)
 *
 * @returns the amount of emojis given
 */
export function emojiGiveEffect() {
    const { emojisPerSecond, emojis } = store.getState().values;

    // calculate best gift
    // Gift wrap (perk) doubles it
    let gift = Math.min(emojisPerSecond * GIFT_SECONDS_OF_PRODUCTION, emojis * GIFT_SHARE_OF_BANK) * giftMultiplier();

    // Adds another random amount of emojis, just to be sure something is given
    const bonus = Math.floor(Math.random() * 1000);

    giveOneOffEmojis(gift + bonus);
    return gift + bonus;
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