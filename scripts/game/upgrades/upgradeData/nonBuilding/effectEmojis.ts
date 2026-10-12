import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";
import { BIG_EMOJI_BUILDING_ID } from "./bigEmoji";

/**
 * Effect emoji upgrades, like Cookie Clicker's golden cookie upgrades. There are no effect
 * emojis at the start: the first of these (Good vibes) turns them on, and the rest make
 * them show up more often and the good ones last longer. Each needs the one before it.
 *
 * They unlock by emojis earned in total, and are kept through prestige like the combo levels.
 */
// By tier
export const EFFECT_EMOJI_UNLOCK_EARNED = [2_000, 1_000_000, 1_000_000_000, 1_000_000_000_000];
export const EFFECT_EMOJI_PRICES = [5_000, 5_000_000, 5_000_000_000, 5_000_000_000_000];

// Effect emoji upgrades get ids from 9800 in the order listed below, clear of every building's range
export const EFFECT_EMOJI_UPGRADE_ID_BLOCK = 98;
const FIRST_EFFECT_EMOJI_UPGRADE_ID = EFFECT_EMOJI_UPGRADE_ID_BLOCK * 100;
export const isEffectEmojiUpgradeId = (id: number) => id >= FIRST_EFFECT_EMOJI_UPGRADE_ID && id < FIRST_EFFECT_EMOJI_UPGRADE_ID + 100;

/** What it does, e.g. "Effect emojis appear ×2 as often" */
export function effectEmojiUpgradeSummary(upgrade: UpgradeType) {
    if (upgrade.effectSpawnRateMultiplier) return `Effect emojis appear ×${upgrade.effectSpawnRateMultiplier} as often`;
    if (upgrade.effectDurationMultiplier) return `Good effects last ×${upgrade.effectDurationMultiplier} as long`;
    return "Effect emojis start appearing";
}

const baseEffectEmojiUpgrade = {
    building: "Big emoji" as BuildingNames,
    buildingId: BIG_EMOJI_BUILDING_ID,
    unlockCondition: "Emojis earned" as UnlockConditionType,
    categories: ["Effect emojis" as UpgradeCateogoriesType],
    variant: "Effect emojis" as UpgradeVariantsType,
};

export const effectEmojiUpgrades: UpgradeType[] = [
    {
        ...baseEffectEmojiUpgrade,
        name: "Good vibes",
        icon: "✨",
        description: "Effect emojis start popping up now and then. Tap them for boosts and gifts!",
        tier: 0,
    },
    {
        ...baseEffectEmojiUpgrade,
        name: "Lucky stars",
        icon: "💫",
        description: "The stars align. Effect emojis appear twice as often.",
        quote: "Wish upon one, get two.",
        tier: 1,
        effectSpawnRateMultiplier: 2,
    },
    {
        ...baseEffectEmojiUpgrade,
        name: "Slow motion",
        icon: "⏱️",
        description: "Time slows down when things are going well. Good effects last twice as long.",
        tier: 2,
        effectDurationMultiplier: 2,
    },
    {
        ...baseEffectEmojiUpgrade,
        name: "Shooting stars",
        icon: "🌠",
        description: "The sky is raining luck. Effect emojis appear twice as often again.",
        quote: "Make a wish. Make several.",
        tier: 3,
        effectSpawnRateMultiplier: 2,
    },
];
