import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Emoji Assembly upgrades
const baseEmojiAssemblyUpgrade = {
    building: "Emoji assembly" as BuildingNames,
    buildingId: 8,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiAssemblyUpgrades: UpgradeType[] = [
    // Emoji Assembly upgrades
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji elections",
        icon: "🗳️",
        description: "May the best emoji win!",
        price: getBuildingUpgradePrice(0, 7),
        tier: 0,
        id: 70,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji stimulus",
        icon: "📊",
        description: "You get an emoji, and you, and you, everybody gets emojis!",
        price: getBuildingUpgradePrice(1, 7),
        tier: 1,
        id: 71,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Speaker of the emoji house",
        icon: "🗣️",
        description: "Install your very own emoji speaker, to ensure things go your way.",
        price: getBuildingUpgradePrice(2, 7),
        tier: 2,
        id: 72,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji laws",
        icon: "📜",
        description: "We the emojis...",
        price: getBuildingUpgradePrice(3, 7),
        tier: 3,
        id: 73,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Global emoji confederation",
        icon: "🌍",
        description: "Increases cooperation between emoji countries.",
        price: getBuildingUpgradePrice(4, 7),
        tier: 4,
        id: 74,
    },
];
