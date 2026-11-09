import Constants, { ExecutionEnvironment } from "expo-constants";

/**
 * Ads on Android and iOS: AdMob (see admob.ts), except in Expo Go
 *
 * Expo Go doesn't include AdMob's native code, and just importing the library
 * crashes the app at start. So Expo Go never loads it, and there no ad ever loads.
 */

const IN_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const admob: typeof import("./admob") | undefined = IN_EXPO_GO ? undefined : require("./admob");

/** Loads the next ad, unless one is loaded or on its way. Resolves with whether it loaded */
export function preloadRewardedAd(): Promise<boolean> {
    return admob ? admob.preloadRewardedAd() : Promise.resolve(false);
}

/** @returns whether the player watched it to the end and earned the reward */
export async function showRewardedAd(): Promise<boolean> {
    return admob ? admob.showRewardedAd() : false;
}

export function preloadInterstitialAd() {
    admob?.preloadInterstitialAd();
}

/** Shows an interstitial at a natural break in the game, if one's ready and it's been a while */
export function showInterstitialAd() {
    admob?.showInterstitialAd();
}

/** Shows app open ads from now on, when the game starts and when the player comes back to it */
export function startAppOpenAds() {
    admob?.startAppOpenAds();
}

/** Whether the player needs a way to change their ad consent (a row in Settings) */
export async function privacyOptionsRequired() {
    return admob ? admob.privacyOptionsRequired() : false;
}

/** Shows Google's form for changing ad consent */
export async function showPrivacyOptions() {
    await admob?.showPrivacyOptions();
}
