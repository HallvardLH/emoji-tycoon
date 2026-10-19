/**
 * Gem packs sold in the gem store (app/gems.tsx)
 *
 * The ids are the product ids in Google Play and RevenueCat. Play never lets
 * an id be used again, even after deleting the product, so don't rename them.
 */

export interface GemPack {
    id: string;
    gems: number;
    icon: string;
    /** Shown while the store's price, in the player's currency, hasn't loaded */
    fallbackPrice: string;
    tag?: string;
}

export const GEM_PACKS: GemPack[] = [
    { id: "gems_80", gems: 80, icon: "💎", fallbackPrice: "$0.99" },
    { id: "gems_500", gems: 500, icon: "👛", fallbackPrice: "$4.99", tag: "POPULAR" },
    { id: "gems_1200", gems: 1200, icon: "💰", fallbackPrice: "$9.99" },
    { id: "gems_2800", gems: 2800, icon: "👑", fallbackPrice: "$19.99", tag: "BEST VALUE" },
];

export type PurchaseResult = "bought" | "cancelled" | "failed";
