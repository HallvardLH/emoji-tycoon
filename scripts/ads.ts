/**
 * Rewarded ads on the web, where AdMob doesn't run (Android and iOS use ads.native.ts)
 *
 * The ad "plays" and succeeds straight away, so the flows that use it can be played.
 */

export function preloadRewardedAd(): Promise<boolean> {
    return Promise.resolve(true);
}

/** @returns whether the player watched it to the end and earned the reward */
export async function showRewardedAd(): Promise<boolean> {
    return true;
}

/** No ad consent to manage on the web */
export async function privacyOptionsRequired() {
    return false;
}

export async function showPrivacyOptions() {}
