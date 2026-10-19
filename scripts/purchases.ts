import { GEM_PACKS, PurchaseResult } from "./game/gemPacks";

/**
 * In-app purchases on the web, where there's no store (Android and iOS use purchases.native.ts)
 *
 * In development every product is "bought" straight away so the gem store can
 * be played. A production web build sells nothing.
 */

export async function loadProducts(ids: string[]): Promise<Record<string, string> | null> {
    if (!__DEV__) return null;
    return Object.fromEntries(GEM_PACKS.filter(pack => ids.includes(pack.id)).map(pack => [pack.id, pack.fallbackPrice]));
}

export async function buyProduct(id: string): Promise<PurchaseResult> {
    return __DEV__ ? "bought" : "failed";
}
