import { AppState, Platform } from "react-native";
import mobileAds, { AdEventType, AdsConsent, AdsConsentInfo, AdsConsentPrivacyOptionsRequirementStatus, AdsConsentStatus, AppOpenAd, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";

/**
 * Ads through Google AdMob (Android and iOS builds, loaded by ads.native.ts; the web
 * uses ads.ts): rewarded ads, interstitials, app open ads and the banner (AdMobBanner.tsx)
 *
 * One of each full screen ad is kept loaded ahead of time so it shows straight away,
 * and the next one starts loading as soon as it's used. Development builds show
 * Google's test ads: tapping real ads on your own device can get the AdMob account banned.
 *
 * Consent comes first, through Google's User Messaging Platform (UMP): where the law
 * asks for it (the EEA, the UK, some US states) the player sees Google's consent form
 * on the first start, and no ad is requested until UMP says ads can be. The form
 * itself is set up in the AdMob console (Privacy & messaging). Players can change
 * their choice later from Settings (see showPrivacyOptions).
 */

// Each platform has its own ad units in AdMob
const unitId = (testId: string, ios: string, android: string) =>
    __DEV__ ? testId : `ca-app-pub-5996643289244524/${Platform.OS === "ios" ? ios : android}`;

const REWARDED_UNIT_ID = unitId(TestIds.REWARDED, "9948133975", "4107070776");
const INTERSTITIAL_UNIT_ID = unitId(TestIds.INTERSTITIAL, "8376229092", "4221536673");
const APP_OPEN_UNIT_ID = unitId(TestIds.APP_OPEN, "9090719978", "8160781681");
export const BANNER_UNIT_ID = unitId(TestIds.ADAPTIVE_BANNER, "3778508530", "5949551318");

// Gives up on an ad that hasn't loaded by then (no connection, no ad to show)
const LOAD_TIMEOUT_MS = 10_000;
// Loaded ads stop being valid after a while: Google's limits are 1 h, and 4 h for app open ads
const AD_MAX_AGE_MS = 60 * 60 * 1000;
const APP_OPEN_MAX_AGE_MS = 4 * 60 * 60 * 1000;
// Ads the player didn't ask for wait this long after any full screen ad
const MIN_MS_BETWEEN_INTERRUPTIONS = 3 * 60 * 1000;
// App open ads are for coming back. Shorter breaks (a notification, a payment sheet) don't count
const APP_OPEN_MIN_AWAY_MS = 60 * 1000;
// At the start the ad only shows if it's ready right away, not once the player is already playing
const COLD_START_WINDOW_MS = 5000;

let consent: Promise<AdsConsentInfo | undefined> | undefined;
let initialized: Promise<unknown> | undefined;
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
export async function canRequestAds() {
    const info = await gatherConsent();
    if (!info?.canRequestAds) return false;
    initialized ??= mobileAds().initialize();
    await initialized;
    return true;
}

/** The request options under the player's current consent */
export const adRequestOptions = () => ({ requestNonPersonalizedAdsOnly: !personalised });

/** Whether the player needs a way to change their ad consent (a row in Settings) */
export async function privacyOptionsRequired() {
    const info = await gatherConsent();
    return info?.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
}

const adChoiceListeners = new Set<() => void>();

/** Calls back when the player changes their ad consent. @returns a function that stops it */
export function onAdChoicesChanged(listener: () => void) {
    adChoiceListeners.add(listener);
    return () => { adChoiceListeners.delete(listener); };
}

/** Shows Google's form for changing ad consent, and applies the new choice to the next ads */
export async function showPrivacyOptions() {
    try {
        const info = await AdsConsent.showPrivacyOptionsForm();
        consent = Promise.resolve(info);
        personalised = await allowsPersonalisedAds(info);
        // The loaded ads were requested under the old choice
        [rewarded, interstitial, appOpen].forEach(slot => slot.discard());
        rewarded.preload();
        interstitial.preload();
        adChoiceListeners.forEach(listener => listener());
    } catch (error) {
        console.warn("Showing the privacy options failed", error);
    }
}

/** What the rewarded, interstitial and app open ads have in common */
interface FullScreenAd {
    loaded: boolean;
    load(): void;
    show(): Promise<void>;
    addAdEventListener(type: any, listener: (payload: any) => void): () => void;
}

/** Keeps one ad of a format loaded and ready */
function adSlot(name: string, loadedEvent: AdEventType | RewardedAdEventType, maxAgeMs: number, create: () => FullScreenAd) {
    let ad: FullScreenAd | undefined;
    let loadedAt = 0;
    let loading: Promise<boolean> | undefined;

    const ready = () => !!ad?.loaded && Date.now() - loadedAt < maxAgeMs;

    /** Requests the next ad. Resolves with whether it loaded */
    const loadNext = () => new Promise<boolean>(resolve => {
        const next = create();
        const done = (loaded: boolean) => {
            clearTimeout(timer);
            unsubscribeLoaded();
            unsubscribeError();
            loading = undefined;
            ad = loaded ? next : undefined;
            loadedAt = Date.now();
            resolve(loaded);
        };
        const timer = setTimeout(() => done(false), LOAD_TIMEOUT_MS);
        const unsubscribeLoaded = next.addAdEventListener(loadedEvent, () => done(true));
        const unsubscribeError = next.addAdEventListener(AdEventType.ERROR, error => {
            console.warn(`${name} ad failed to load`, error);
            done(false);
        });
        next.load();
    });

    return {
        /** Loads the next ad, unless one is loaded or on its way. Resolves with whether it loaded */
        preload(): Promise<boolean> {
            if (ready()) return Promise.resolve(true);
            if (loading) return loading;

            loading = canRequestAds().then(canRequest => {
                // Not allowed (yet): nothing to wait for, so the next call asks again
                if (!canRequest) {
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
        },
        /** Hands over the loaded ad, if there is one that's still good */
        take() {
            if (!ready()) return undefined;
            const taken = ad;
            ad = undefined;
            return taken;
        },
        discard() {
            ad = undefined;
        },
    };
}

type AdSlot = ReturnType<typeof adSlot>;

const rewarded = adSlot("Rewarded", RewardedAdEventType.LOADED, AD_MAX_AGE_MS,
    () => RewardedAd.createForAdRequest(REWARDED_UNIT_ID, adRequestOptions()));
const interstitial = adSlot("Interstitial", AdEventType.LOADED, AD_MAX_AGE_MS,
    () => InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID, adRequestOptions()));
const appOpen = adSlot("App open", AdEventType.LOADED, APP_OPEN_MAX_AGE_MS,
    () => AppOpenAd.createForAdRequest(APP_OPEN_UNIT_ID, adRequestOptions()));

// On Android a full screen ad sends the app to the background: this tells that apart from leaving
let fullScreenAdOpen = false;
let lastFullScreenAdAt = 0;

/** Shows the ad until it's closed. @returns whether it paid out a reward */
function present(showing: FullScreenAd, slot: AdSlot, rewardEvent?: RewardedAdEventType) {
    fullScreenAdOpen = true;
    return new Promise<boolean>(resolve => {
        let earned = false;
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            unsubscribers.forEach(unsubscribe => unsubscribe());
            fullScreenAdOpen = false;
            lastFullScreenAdAt = Date.now();
            resolve(earned);
            // Ready for next time
            slot.preload();
        };
        const unsubscribers = [
            showing.addAdEventListener(AdEventType.CLOSED, finish),
            showing.addAdEventListener(AdEventType.ERROR, error => {
                console.warn("Ad failed to show", error);
                finish();
            }),
        ];
        if (rewardEvent) unsubscribers.push(showing.addAdEventListener(rewardEvent, () => { earned = true; }));
        showing.show().catch(error => {
            console.warn("Ad failed to show", error);
            finish();
        });
    });
}

/** Whether an ad the player didn't ask for may show right now */
const canInterrupt = () => !fullScreenAdOpen
    && AppState.currentState === "active"
    && Date.now() - lastFullScreenAdAt >= MIN_MS_BETWEEN_INTERRUPTIONS;

/** Shows the slot's ad if it's ready and now's a fine time; otherwise just gets one ready */
function showIfReady(slot: AdSlot) {
    if (!canInterrupt()) return;
    const showing = slot.take();
    if (showing) present(showing, slot);
    else slot.preload();
}

export const preloadRewardedAd = () => rewarded.preload();

/**
 * Shows a rewarded ad, loading one first if needed
 *
 * @returns whether the player watched it to the end and earned the reward
 */
export async function showRewardedAd(): Promise<boolean> {
    if (!(await rewarded.preload())) return false;
    const showing = rewarded.take();
    return showing ? present(showing, rewarded, RewardedAdEventType.EARNED_REWARD) : false;
}

export const preloadInterstitialAd = () => interstitial.preload();

/** Shows an interstitial at a natural break in the game, if one's ready and it's been a while */
export function showInterstitialAd() {
    showIfReady(interstitial);
}

/**
 * Shows app open ads from now on, when the game starts and when the player comes
 * back to it after a while. Call once
 */
export function startAppOpenAds() {
    let backgroundSince: number | undefined;
    AppState.addEventListener("change", state => {
        if (state === "background") {
            if (!fullScreenAdOpen) backgroundSince = Date.now();
        } else if (state === "active") {
            const away = backgroundSince === undefined ? 0 : Date.now() - backgroundSince;
            backgroundSince = undefined;
            if (away >= APP_OPEN_MIN_AWAY_MS) showIfReady(appOpen);
        }
    });

    const startedAt = Date.now();
    appOpen.preload().then(loaded => {
        if (loaded && Date.now() - startedAt <= COLD_START_WINDOW_MS) showIfReady(appOpen);
    });
}
