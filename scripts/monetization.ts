/**
 * Placeholders for rewarded ads and the premium currency, which don't exist yet.
 * Both succeed straight away so the flows that use them can be played.
 */

/**
 * Shows a rewarded ad
 *
 * TODO: plug in the ad SDK
 *
 * @returns whether the player watched it to the end and earned the reward
 */
export async function watchRewardedAd(): Promise<boolean> {
    return true;
}

/**
 * Spends premium currency
 *
 * TODO: plug in the premium currency (bought for real money)
 *
 * @returns whether the player had enough and it was spent
 */
export async function spendPremiumCurrency(amount: number): Promise<boolean> {
    return true;
}
