import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseEmojiBlackHoleUpgrade = {
    building: "Emoji black hole" as BuildingNames,
    buildingId: 15,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiBlackHoleUpgrades: UpgradeType[] = [
    {
        ...baseEmojiBlackHoleUpgrade,
        name: "Event horizon",
        icon: "🌌",
        description: "Nothing escapes a black hole. Except emojis, apparently.",
        tier: 0,
        id: 1600,
    },
    {
        ...baseEmojiBlackHoleUpgrade,
        name: "Planet devourer",
        icon: "🪐",
        description: "Swallows planets whole and spits out emojis.",
        tier: 1,
        id: 1601,
    },
    {
        ...baseEmojiBlackHoleUpgrade,
        name: "Spaghettification",
        icon: "🍝",
        description: "Stretches emojis into long, thin, extra-productive noodles.",
        quote: "Mamma mia!",
        tier: 2,
        id: 1602,
    },
    {
        ...baseEmojiBlackHoleUpgrade,
        name: "Hawking radiation",
        icon: "☢️",
        description: "Black holes leak emojis after all. Stephen was right.",
        tier: 3,
        id: 1603,
    },
    {
        ...baseEmojiBlackHoleUpgrade,
        name: "Wormholes",
        icon: "🌠",
        description: "Shortcuts to other universes, each full of emojis to take.",
        tier: 4,
        id: 1604,
    },
];
