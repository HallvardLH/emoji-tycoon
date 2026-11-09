import store from "../../redux/reduxStore";
import { AdReward, addGems, countAdReward } from "../../redux/gemsSlice";
import { watchRewardedAd } from "../../monetization";
import { grantAdBoost } from "./gemShop";

/**
 * What the player can watch a rewarded ad for, besides the welcome back offer.
 * Limited per day (by the device's calendar), so ads stay a top-up next to the gem packs.
 */

/** Gems for watching one ad */
export const AD_GEMS = 2;

const REWARDS_PER_DAY: Record<AdReward, number> = {
    gems: 5,
    boost: 3,
};

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

/** How many more ads the player can watch for this reward today */
export function adRewardsLeft(reward: AdReward) {
    const counted = store.getState().gems.adRewards;
    const watched = counted?.day === today() ? counted.counts[reward] ?? 0 : 0;
    return Math.max(0, REWARDS_PER_DAY[reward] - watched);
}

/** @returns whether the player watched the ad to the end and got the reward */
async function watchFor(reward: AdReward, give: () => void) {
    if (adRewardsLeft(reward) <= 0) return false;
    if (!(await watchRewardedAd())) return false;
    store.dispatch(countAdReward({ day: today(), reward }));
    give();
    return true;
}

export const watchAdForGems = () => watchFor("gems", () => store.dispatch(addGems(AD_GEMS)));

export const watchAdForBoost = () => watchFor("boost", grantAdBoost);
