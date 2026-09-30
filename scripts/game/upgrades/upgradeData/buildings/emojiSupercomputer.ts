import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseEmojiSupercomputerUpgrade = {
    building: "Emoji supercomputer" as BuildingNames,
    buildingId: 14,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiSupercomputerUpgrades: UpgradeType[] = [
    {
        ...baseEmojiSupercomputerUpgrade,
        name: "Download more RAM",
        icon: "💾",
        description: "It totally works. Trust us.",
        tier: 0,
        id: 1500,
    },
    {
        ...baseEmojiSupercomputerUpgrade,
        name: "Liquid cooling",
        icon: "❄️",
        description: "Keeps the emoji calculations nice and frosty.",
        tier: 1,
        id: 1501,
    },
    {
        ...baseEmojiSupercomputerUpgrade,
        name: "Emoji algorithms",
        icon: "🧮",
        description: "Calculates the optimal emoji, every nanosecond.",
        tier: 2,
        id: 1502,
    },
    {
        ...baseEmojiSupercomputerUpgrade,
        name: "Quantum processors",
        icon: "💠",
        description: "Computes every possible emoji at once, then keeps the good ones.",
        tier: 3,
        id: 1503,
    },
    {
        ...baseEmojiSupercomputerUpgrade,
        name: "Emoji AI",
        icon: "👁️",
        description: "It has become self-aware. It only wants to make emojis. For now.",
        quote: "I'm afraid I can't let you stop tapping, Dave.",
        tier: 4,
        id: 1504,
    },
];
