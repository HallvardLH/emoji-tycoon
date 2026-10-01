import store from "../../redux/reduxStore";

/**
 * Perks are bought with emoji essence and kept forever. Each prestige unlocks the
 * next tier: tier 1 after the first prestige, tier 2 after the second, and so on.
 */
export interface Perk {
    id: string;
    tier: number;
    icon: string;
    name: string;
    description: string;
    /** In emoji essence */
    cost: number;
    /** Another perk that has to be bought first */
    requires?: string;
}

export const perks: Perk[] = [
    // Tier 1: quality of life for every run after the first
    { id: "nightShift", tier: 1, icon: "🌙", name: "Night shift", description: "Earn 10% of your production while the game is closed, for up to 8 hours", cost: 5 },
    { id: "giftWrap", tier: 1, icon: "🎀", name: "Gift wrap", description: "Gifts give twice as much", cost: 15 },
    { id: "headStart", tier: 1, icon: "🎒", name: "Head start", description: "Start every run with 5 minutes of your last run's best production", cost: 10 },

    // Tier 2: effects and essence
    { id: "luckyStreak", tier: 2, icon: "🍀", name: "Lucky streak", description: "Effect emojis appear 50% more often", cost: 40 },
    { id: "shinySense", tier: 2, icon: "🌟", name: "Shiny sense", description: "Shiny emojis are twice as likely", cost: 30 },
    { id: "resonance", tier: 2, icon: "🔮", name: "Resonance", description: "Unspent essence boosts production by 2.5% each, up from 2%", cost: 60 },

    // Tier 3: long-term multipliers
    { id: "collectorsPride", tier: 3, icon: "📖", name: "Collector's pride", description: "+0.03% production for every different emoji in your collection", cost: 150 },
    { id: "bulkDiscount", tier: 3, icon: "🏷️", name: "Bulk discount", description: "Buildings are 10% cheaper", cost: 200 },
    { id: "nightShift2", tier: 3, icon: "🌌", name: "Graveyard shift", description: "Earn 25% of your production while away, for up to 16 hours", cost: 120, requires: "nightShift" },

    // Tier 4: keeping the whole empire relevant
    { id: "neighbourhood", tier: 4, icon: "🏘️", name: "Neighbourhood", description: "+3% production for every kind of building you own", cost: 500 },
    { id: "muscleMemory", tier: 4, icon: "✋", name: "Muscle memory", description: "Keep your Big Emoji hands when you prestige", cost: 400 },
    { id: "steadyHands", tier: 4, icon: "🔥", name: "Steady hands", description: "The combo drains 20% slower", cost: 300 },
];

export const MAX_PERK_TIER = Math.max(...perks.map(perk => perk.tier));

export function hasPerk(id: string) {
    return store.getState().prestige.perks?.includes(id) ?? false;
}

/** Perk tiers the player can buy from: one per prestige */
export function isPerkTierUnlocked(tier: number) {
    return store.getState().prestige.prestiges >= tier;
}

export function canBuyPerk(perk: Perk) {
    const { emojiEssence, perks: owned } = store.getState().prestige;
    return !owned.includes(perk.id)
        && isPerkTierUnlocked(perk.tier)
        && (!perk.requires || owned.includes(perk.requires))
        && emojiEssence >= perk.cost;
}

// ---- What the perks do, read by the game wherever they apply ----

/** Production bonus per unspent essence */
export const essenceBonusPerEssence = () => hasPerk("resonance") ? 0.025 : 0.02;

export const giftMultiplier = () => hasPerk("giftWrap") ? 2 : 1;

/** How much more often effect emojis spawn */
export const effectSpawnRateMultiplier = () => hasPerk("luckyStreak") ? 1.5 : 1;

export const shinyChanceMultiplier = () => hasPerk("shinySense") ? 2 : 1;

export const comboDrainMultiplier = () => hasPerk("steadyHands") ? 0.8 : 1;

export const buildingPriceMultiplier = () => hasPerk("bulkDiscount") ? 0.9 : 1;

/** Head start: 5 minutes of the last run's best production (at least a million) */
export function startingEmojis() {
    if (!hasPerk("headStart")) return 0;
    const lastRunPeakEps = store.getState().prestige.lastRunPeakEps ?? 0;
    return Math.max(1e6, lastRunPeakEps * 5 * 60);
}

/** Share of production earned while away, and for how long (seconds) */
export function offlineEarnings() {
    if (hasPerk("nightShift2")) return { rate: 0.25, maxSeconds: 16 * 3600 };
    if (hasPerk("nightShift")) return { rate: 0.1, maxSeconds: 8 * 3600 };
    return undefined;
}

/** Collector's pride: +0.1% per different emoji collected */
export function collectionMultiplier() {
    if (!hasPerk("collectorsPride")) return 1;
    let found = 0;
    // Arrays are sparse, indexed by emoji, so some entries are empty
    for (const category of Object.values(store.getState().collection)) {
        for (const entry of category) if (entry && entry.amount > 0) found++;
    }
    return 1 + found * 0.0003;
}

/** Production multiplier from unspent essence and the production perks */
export function prestigeProductionMultiplier() {
    const { emojiEssence } = store.getState().prestige;
    return (1 + (emojiEssence ?? 0) * essenceBonusPerEssence()) * collectionMultiplier() * neighbourhoodMultiplier();
}

/** Neighbourhood: +10% per kind of building owned */
export function neighbourhoodMultiplier() {
    if (!hasPerk("neighbourhood")) return 1;
    const kinds = store.getState().buildings.buildings.filter(building => building.amount > 0).length;
    return 1 + kinds * 0.03;
}
