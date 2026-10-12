import store from "../../redux/reduxStore";
import { trialEffectSpawnMultiplier, trialProductionMultiplier, trialsCompletedCount } from "./trials";

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
    { id: "overtime", tier: 1, icon: "⏳", name: "Overtime", description: "Good effects last 50% longer", cost: 5 },
    { id: "giftWrap", tier: 1, icon: "🎀", name: "Gift wrap", description: "Gifts give twice as much", cost: 15 },
    { id: "headStart", tier: 1, icon: "🎒", name: "Head start", description: "Start every run with 5 minutes of your last run's best production", cost: 10 },

    // Tier 2: effects and essence
    { id: "luckyStreak", tier: 2, icon: "🍀", name: "Lucky streak", description: "Effect emojis appear 50% more often", cost: 40 },
    { id: "shinySense", tier: 2, icon: "🌟", name: "Shiny sense", description: "Shiny emojis are twice as likely", cost: 30 },
    { id: "resonance", tier: 2, icon: "🔮", name: "Resonance", description: "Unspent essence boosts production by 2.5% each, up from 2%", cost: 60 },

    // Tier 3: long-term multipliers
    { id: "collectorsPride", tier: 3, icon: "📖", name: "Collector's pride", description: "+0.03% production for every different emoji in your collection", cost: 150 },
    { id: "bulkDiscount", tier: 3, icon: "🏷️", name: "Bulk discount", description: "Buildings are 10% cheaper", cost: 200 },
    { id: "magnet", tier: 3, icon: "🧲", name: "Magnet", description: "Effect emojis stay on screen twice as long", cost: 120 },

    // Tier 4: keeping the whole empire relevant
    { id: "neighbourhood", tier: 4, icon: "🏘️", name: "Neighbourhood", description: "+3% production for every kind of building you own", cost: 500 },
    { id: "muscleMemory", tier: 4, icon: "✋", name: "Muscle memory", description: "Keep your Big Emoji hands when you prestige", cost: 400 },
    { id: "steadyHands", tier: 4, icon: "🔥", name: "Steady hands", description: "The combo drains 20% slower", cost: 300 },

    // Tier 5: rewarding long runs and skill
    { id: "momentum", tier: 5, icon: "🌊", name: "Momentum", description: "+1% production for every 10 minutes played this run, up to +50%", cost: 800 },
    { id: "secondWind", tier: 5, icon: "💨", name: "Second wind", description: "+1 to your max combo", cost: 1000 },
    { id: "goldenTouch", tier: 5, icon: "👑", name: "Golden touch", description: "Shiny emojis are worth 5 times as much", cost: 600 },

    // Tier 6: the late game, where runs get long and essence piles up
    { id: "overflow", tier: 6, icon: "🫗", name: "Overflow", description: "Spent essence keeps half its production bonus", cost: 2500 },
    { id: "hallOfFame", tier: 6, icon: "🏆", name: "Hall of fame", description: "+10% production for every trial completed", cost: 2000 },
    { id: "flyingStart", tier: 6, icon: "🚀", name: "Flying start", description: "Head start gives 30 minutes of production instead of 5", cost: 1500, requires: "headStart" },
];

/** Perks that no longer exist. Saves that bought them get the essence back (see startPrestige) */
export const removedPerks = [
    // Offline earnings, now claimed with an ad or premium currency (see offline.ts)
    { id: "nightShift", cost: 5 },
    { id: "nightShift2", cost: 120 },
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

/** How much more often effect emojis spawn (Lucky streak, and the Dark sky trial reward) */
export const effectSpawnRateMultiplier = () => (hasPerk("luckyStreak") ? 1.5 : 1) * trialEffectSpawnMultiplier();

export const shinyChanceMultiplier = () => hasPerk("shinySense") ? 2 : 1;

export const comboDrainMultiplier = () => hasPerk("steadyHands") ? 0.8 : 1;

export const buildingPriceMultiplier = () => hasPerk("bulkDiscount") ? 0.9 : 1;

/** Head start: 5 minutes of the last run's best production (at least a million), 30 with Flying start */
export function startingEmojis() {
    if (!hasPerk("headStart")) return 0;
    const lastRunPeakEps = store.getState().prestige.lastRunPeakEps ?? 0;
    const minutes = hasPerk("flyingStart") ? 30 : 5;
    return Math.max(1e6, lastRunPeakEps * minutes * 60);
}

/** Second wind: extra max combo */
export const maxComboBonus = () => hasPerk("secondWind") ? 1 : 0;

/** Golden touch: what shiny emojis are worth */
export const shinyRewardMultiplier = () => hasPerk("goldenTouch") ? 5 : 1;

/** Momentum: +1% per 10 minutes played this run, up to +50% */
export function momentumMultiplier() {
    if (!hasPerk("momentum")) return 1;
    const minutes = (store.getState().prestige.runSeconds ?? 0) / 60;
    return 1 + Math.min(0.5, Math.floor(minutes / 10) * 0.01);
}

/** Hall of fame: +10% per trial completed */
export const hallOfFameMultiplier = () => hasPerk("hallOfFame") ? 1 + trialsCompletedCount() * 0.1 : 1;

/** Perks whose bonus changes during a run, so production is recalculated regularly */
export const hasChangingProductionPerk = () => hasPerk("collectorsPride") || hasPerk("momentum");

/** Overtime: how much longer good effects last */
export const goodEffectDurationMultiplier = () => hasPerk("overtime") ? 1.5 : 1;

/** Magnet: how much longer effect emojis stay on screen */
export const effectOnScreenMultiplier = () => hasPerk("magnet") ? 2 : 1;

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

/** Essence counting towards the production bonus: what's unspent, plus half of what's spent with Overflow */
export function essenceForBonus() {
    const { emojiEssence = 0, totalEssenceEarned = 0 } = store.getState().prestige;
    if (!hasPerk("overflow")) return emojiEssence;
    const spent = Math.max(0, totalEssenceEarned - emojiEssence);
    return emojiEssence + spent / 2;
}

/** Production multiplier from essence, the production perks and trial rewards */
export function prestigeProductionMultiplier() {
    return (1 + essenceForBonus() * essenceBonusPerEssence())
        * collectionMultiplier()
        * neighbourhoodMultiplier()
        * momentumMultiplier()
        * hallOfFameMultiplier()
        * trialProductionMultiplier();
}

/** Neighbourhood: +10% per kind of building owned */
export function neighbourhoodMultiplier() {
    if (!hasPerk("neighbourhood")) return 1;
    const kinds = store.getState().buildings.buildings.filter(building => building.amount > 0).length;
    return 1 + kinds * 0.03;
}
