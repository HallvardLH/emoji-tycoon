import { Platform } from "react-native";
import mobileAds, { AdEventType, AdsConsent, AdsConsentInfo, AdsConsentPrivacyOptionsRequirementStatus, AdsConsentStatus, RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";

/**
 * Rewarded ads through Google AdMob (Android and iOS; the web uses ads.ts)
 *
 * One ad is kept loaded ahead of time so it shows straight away, and the next
 * one starts loading as soon as it's used. Development builds show Google's
 * test ads: tapping real ads on your own device can get the AdMob account banned.
 *
 * Consent comes first, through Google's User Messaging Platform (UMP): where the law
 * asks for it (the EEA, the UK, some US states) the player sees Google's consent form
 * on the first start, and no ad is requested until UMP says ads can be. The form
 * itself is set up in the AdMob console (Privacy & messaging). Players can change
 * their choice later from Settings (see showPrivacyOptions).
 */

// Each platform has its own ad unit in AdMob
const REWARDED_UNIT_ID = __DEV__
    ? TestIds.REWARDED
    : Platform.OS === "ios" ? "ca-app-pub-5996643289244524/9948133975" : "ca-app-pub-5996643289244524/4107070776";
// Gives up on an ad that hasn't loaded by then (no connection, no ad to show)
const LOAD_TIMEOUT_MS = 10_000;

let consent: Promise<AdsConsentInfo | undefined> | undefined;
let initialized: Promise<unknown> | undefined;
let ad: RewardedAd | undefined;
let loading: Promise<boolean> | undefined;
// Personalised ads only with consent for them (or where none is needed)
let personalised = false;

/**
 * Asks for consent if it's needed, once per start (showing the form if it has to)
 *
 * @returns the consent info, or undefined if UMP couldn't be reached and no earlier answer is known
 */
function gatherConsent() {
    consent ??= AdsConsent.gatherConsent()
        // Offline: go on with the answer from an earlier start, if there is one
        .catch(error => {
            console.warn("Gathering ad consent failed", error);
            return AdsConsent.getConsentInfo().catch(() => undefined);
        })
        .then(async info => {
            // No answer at all: ask again next time ads are wanted
            if (!info) consent = undefined;
            personalised = info ? await allowsPersonalisedAds(info) : false;
            return info;
        });
    return consent;
}

async function allowsPersonalisedAds(info: AdsConsentInfo) {
    if (info.status === AdsConsentStatus.NOT_REQUIRED) return true;
    if (info.status !== AdsConsentStatus.OBTAINED) return false;
    try {
        const choices = await AdsConsent.getUserChoices();
        return choices.storeAndAccessInformationOnDevice && choices.selectPersonalisedAds;
    } catch {
        return false;
    }
}

/** Starts the ads SDK once consent allows ads. Resolves with whether ads can be requested */
async function initialize() {
    const info = await gatherConsent();
    if (!info?.canRequestAds) return false;
    initialized ??= mobileAds().initialize();
    await initialized;
    return true;
}

/** Whether the player needs a way to change their ad consent (a row in Settings) */
export async function privacyOptionsRequired() {
    const info = await gatherConsent();
    return info?.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
}

/** Shows Google's form for changing ad consent, and applies the new choice to the next ads */
export async function showPrivacyOptions() {
    try {
        const info = await AdsConsent.showPrivacyOptionsForm();
        consent = Promise.resolve(info);
        personalised = await allowsPersonalisedAds(info);
        // The loaded ad was requested under the old choice
        ad = undefined;
        preloadRewardedAd();
    } catch (error) {
        console.warn("Showing the privacy options failed", error);
    }
}

/** Loads the next ad, unless one is loaded or on its way. Resolves with whether it loaded */
export function preloadRewardedAd(): Promise<boolean> {
    if (ad?.loaded) return Promise.resolve(true);
    if (loading) return loading;

    loading = initialize().then(canRequestAds => {
        // Not allowed (yet): nothing to wait for, so the next call asks again
        if (!canRequestAds) {
            loading = undefined;
            return false;
        }
        return loadNext();
    }).catch(error => {
        console.warn("Ads failed to start", error);
        loading = undefined;
        return false;
    });
    return loading;
}

/** Requests the next ad. Resolves with whether it loaded */
function loadNext() {
    return new Promise<boolean>(resolve => {
        const next = RewardedAd.createForAdRequest(REWARDED_UNIT_ID, {
            requestNonPersonalizedAdsOnly: !personalised,
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
    });
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
