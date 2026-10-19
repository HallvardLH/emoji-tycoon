import { Platform } from "react-native";
import Purchases, { PRODUCT_CATEGORY, PurchasesStoreProduct } from "react-native-purchases";
import type { PurchaseResult } from "./game/gemPacks";

/**
 * In-app purchases through RevenueCat (Android and iOS; the web uses purchases.ts)
 *
 * Development builds use RevenueCat's Test Store, so purchases can be tried
 * without real money or a Play listing. Release builds use Google Play. These
 * are public SDK keys, made to be shipped in the app.
 */

const API_KEY = __DEV__
    ? "test_bxdwOjQbxHFeqWNptzxyWGQYMpB"
    : Platform.OS === "android" ? "goog_QZsRcvCnVMKFPMeRWGnnFQyilKS" : undefined;

let configured = false;
const products = new Map<string, PurchasesStoreProduct>();

function configure() {
    if (!API_KEY) return false;
    if (!configured) {
        Purchases.configure({ apiKey: API_KEY });
        configured = true;
    }
    return true;
}

/**
 * Fetches the products from the store
 *
 * @returns each product's price in the player's currency by id, without the ones
 * the store doesn't have, or null when the store can't be reached
 */
export async function loadProducts(ids: string[]): Promise<Record<string, string> | null> {
    if (!configure()) return null;
    try {
        const found = await Purchases.getProducts(ids, PRODUCT_CATEGORY.NON_SUBSCRIPTION);
        const prices: Record<string, string> = {};
        for (const product of found) {
            products.set(product.identifier, product);
            prices[product.identifier] = product.priceString;
        }
        return prices;
    } catch (error) {
        console.warn("Loading products failed", error);
        return null;
    }
}

/** Opens the store's payment sheet for a product loaded by loadProducts */
export async function buyProduct(id: string): Promise<PurchaseResult> {
    const product = products.get(id);
    if (!configure() || !product) return "failed";
    try {
        await Purchases.purchaseStoreProduct(product);
        return "bought";
    } catch (error: any) {
        if (error?.userCancelled || error?.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return "cancelled";
        console.warn("Purchase failed", error);
        return "failed";
    }
}
