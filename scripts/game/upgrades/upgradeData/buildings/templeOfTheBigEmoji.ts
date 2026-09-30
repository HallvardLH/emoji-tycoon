import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseTempleUpgrade = {
    building: "Temple of the Big Emoji in the sky" as BuildingNames,
    buildingId: 13,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const templeOfTheBigEmojiUpgrades: UpgradeType[] = [
    {
        ...baseTempleUpgrade,
        name: "Prayer candles",
        icon: "🕯️",
        description: "Each flame burns in honor of the Big Emoji in the sky.",
        tier: 0,
        id: 1400,
    },
    {
        ...baseTempleUpgrade,
        name: "Prayer beads",
        icon: "📿",
        description: "Count your blessings. Then count your emojis.",
        tier: 1,
        id: 1401,
    },
    {
        ...baseTempleUpgrade,
        name: "Temple bells",
        icon: "🔔",
        description: "Every ring summons a fresh emoji from the heavens.",
        tier: 2,
        id: 1402,
    },
    {
        ...baseTempleUpgrade,
        name: "Pilgrims",
        icon: "🚶",
        description: "Followers travel from every corner of the world, just to tap the Big Emoji once.",
        tier: 3,
        id: 1403,
    },
    {
        ...baseTempleUpgrade,
        name: "Divine revelation",
        icon: "🌟",
        description: "The Big Emoji in the sky looks down upon you. It is smiling.",
        quote: "😀",
        tier: 4,
        id: 1404,
    },
];
