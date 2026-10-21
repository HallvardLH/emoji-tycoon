import mobileAds, { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";

/**
 * Rewarded ads through Google AdMob (Android and iOS; the web uses ads.ts)
 *
 * One ad is kept loaded ahead of time so it shows straight away, and the next
 * one starts loading as soon as it's used. Development builds show Google's
 * test ads: tapping real ads on your own device can get the AdMob account banned.
 */

const REWARDED_UNIT_ID = __DEV__ ? TestIds.REWARDED : "ca-app-pub-5996643289244524/4107070776";
// Gives up on an ad that hasn't loaded by then (no connection, no ad to show)
const LOAD_TIMEOUT_MS = 10_000;

let initialized: Promise<unknown> | undefined;
let ad: RewardedAd | undefined;
let loading: Promise<boolean> | undefined;

function initialize() {
    initialized ??= mobileAds().initialize();
    return initialized;
}

/** Loads the next ad, unless one is loaded or on its way. Resolves with whether it loaded */
export function preloadRewardedAd(): Promise<boolean> {
    if (ad?.loaded) return Promise.resolve(true);
    if (loading) return loading;

    loading = initialize().then(() => new Promise<boolean>(resolve => {
        const next = RewardedAd.createForAdRequest(REWARDED_UNIT_ID, {
            // Until there's a consent form, required in the EEA for personalised ads
            requestNonPersonalizedAdsOnly: true,
        });
        const done = (loaded: boolean) => {
            clearTimeout(timer);
            unsubscribeLoaded();
            unsubscribeError();
            loading = undefined;
            ad = loaded ? next : undefined;
            resolve(loaded);
        };
        const timer = setTimeout(() => done(false), LOAD_TIMEOUT_MS);
        const unsubscribeLoaded = next.addAdEventListener(RewardedAdEventType.LOADED, () => done(true));
        const unsubscribeError = next.addAdEventListener(AdEventType.ERROR, error => {
            console.warn("Rewarded ad failed to load", error);
            done(false);
        });
        next.load();
    })).catch(error => {
        console.warn("Ads failed to start", error);
        loading = undefined;
        return false;
    });
    return loading;
}

/**
 * Shows a rewarded ad, loading one first if needed
 *
 * @returns whether the player watched it to the end and earned the reward
 */
export async function showRewardedAd(): Promise<boolean> {
    if (!(await preloadRewardedAd()) || !ad) return false;

    const showing = ad;
    ad = undefined;
    return new Promise<boolean>(resolve => {
        let earned = false;
        const finish = () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
            resolve(earned);
            // Ready for next time
            preloadRewardedAd();
        };
        const unsubscribers = [
            showing.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => { earned = true; }),
            showing.addAdEventListener(AdEventType.CLOSED, finish),
            showing.addAdEventListener(AdEventType.ERROR, error => {
                console.warn("Rewarded ad failed to show", error);
                finish();
            }),
        ];
        showing.show().catch(error => {
            console.warn("Rewarded ad failed to show", error);
            finish();
        });
    });
}
