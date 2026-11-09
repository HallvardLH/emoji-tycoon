/**
 * Ads on the web, where AdMob doesn't run (Android and iOS use ads.native.ts)
 *
 * A rewarded ad "plays" and succeeds straight away, so the flows that use it can be played.
 * The ads the player doesn't ask for simply don't exist here.
 */

export function preloadRewardedAd(): Promise<boolean> {
    return Promise.resolve(true);
}

/** @returns whether the player watched it to the end and earned the reward */
export async function showRewardedAd(): Promise<boolean> {
    return true;
}

export function preloadInterstitialAd() {}

export function showInterstitialAd() {}

export function startAppOpenAds() {}

/** No ad consent to manage on the web */
export async function privacyOptionsRequired() {
    return false;
}

export async function showPrivacyOptions() {}
