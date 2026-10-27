import store from "../../redux/reduxStore";
import { addGems, markRewarded } from "../../redux/gemsSlice";

/**
 * Gems earned by playing, so every player gets to use the gem features. Kept scarce:
 * a gem every TAP_GEM_EVERY taps of the Big Emoji, and some for each prestige.
 *
 * Keyed rewards pay once ever: the list is kept through prestiges and game resets,
 * like the gems, so starting over can't farm them.
 */

export const PRESTIGE_GEMS = 10;

/** Every this many Big Emoji taps (all-time) gives a gem */
export const TAP_GEM_EVERY = 500;

const isRewarded = (key: string) => (store.getState().gems.rewarded ?? []).includes(key);

/**
 * Pays out the rewards not paid yet
 *
 * @returns the gems given
 */
export function rewardGems(rewards: { key: string, gems: number }[]) {
    const unpaid = rewards.filter(reward => !isRewarded(reward.key));
    if (unpaid.length === 0) return 0;
    const total = unpaid.reduce((sum, reward) => sum + reward.gems, 0);
    store.dispatch(markRewarded(unpaid.map(reward => reward.key)));
    store.dispatch(addGems(total));
    return total;
}

/**
 * A gem for every TAP_GEM_EVERY taps. Not keyed: the tap count only goes up within
 * a game (it starts over on a game reset, which is a lot of tapping to farm)
 *
 * @param taps all-time Big Emoji taps, counting the one just made
 * @returns whether this tap gave a gem
 */
export function checkTapGem(taps: number) {
    if (taps <= 0 || taps % TAP_GEM_EVERY !== 0) return false;
    store.dispatch(addGems(1));
    return true;
}
