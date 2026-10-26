import { useSyncExternalStore } from "react";
import store from "./redux/reduxStore";
import { addGems, spendGems as spendGemsAction } from "./redux/gemsSlice";
import { preloadRewardedAd, showRewardedAd } from "./ads";
import { buyProduct } from "./purchases";
import { GemPack, PurchaseResult } from "./game/gemPacks";

/**
 * Rewarded ads (see ads.native.ts) and gems, the premium currency, bought
 * in the gem store (see purchases.native.ts)
 */

/**
 * Shows a rewarded ad
 *
 * @returns whether the player watched it to the end and earned the reward
 */
export function watchRewardedAd(): Promise<boolean> {
    return showRewardedAd();
}

/**
 * Whether a rewarded ad can be shown: loads one if needed
 *
 * @returns false when there's none to show (offline, no consent, or AdMob not serving the app)
 */
export function rewardedAdAvailable(): Promise<boolean> {
    return preloadRewardedAd();
}

export function getGems() {
    return store.getState().gems.gems;
}

/**
 * Spends gems
 *
 * @returns whether the player had enough and they were spent
 */
export function spendGems(amount: number): boolean {
    if (getGems() < amount) return false;
    store.dispatch(spendGemsAction(amount));
    return true;
}

/** Buys a gem pack for real money, and adds the gems once it's paid for */
export async function buyGemPack(pack: GemPack): Promise<PurchaseResult> {
    const result = await buyProduct(pack.id);
    if (result === "bought") store.dispatch(addGems(pack.gems));
    return result;
}

// Whether the gem store screen is open. Set by the screen itself: the root
// layout's pathname doesn't update when the store closes
let gemStoreOpen = false;
const gemStoreListeners = new Set<() => void>();

export function setGemStoreOpen(open: boolean) {
    gemStoreOpen = open;
    gemStoreListeners.forEach(listener => listener());
}

const subscribeGemStoreOpen = (listener: () => void) => {
    gemStoreListeners.add(listener);
    return () => { gemStoreListeners.delete(listener); };
};

export function useGemStoreOpen() {
    return useSyncExternalStore(subscribeGemStoreOpen, () => gemStoreOpen);
}
