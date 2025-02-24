import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Emoji Assembly upgrades
const baseEmojiAssemblyUpgrade = {
    building: "Emoji assembly" as BuildingNames,
    buildingId: 9,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

const emojiAssemblyHelperUpgrade = {
    ...baseEmojiAssemblyUpgrade,
    categories: ["Percentage increase production" as UpgradeCateogoriesType],
    unlockCondition: "Building helper" as UnlockConditionType,
    emojisPerSecondPercentageIncrease: 0.01,
    variant: "Helper" as UpgradeVariantsType,
};

export const emojiAssemblyUpgrades: UpgradeType[] = [
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji elections",
        icon: "🗳️",
        description: "May the best emoji win!",
        tier: 0,
        id: 1000,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji stimulus",
        icon: "📊",
        description: "You get an emoji, and you, and you, everybody gets emojis!",
        tier: 1,
        id: 1001,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Speaker of the emoji house",
        icon: "🗣️",
        description: "Install your very own emoji speaker, to ensure things go your way.",
        tier: 2,
        id: 1002,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji laws",
        icon: "📜",
        description: "We the emojis...",
        tier: 3,
        id: 1003,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Global emoji confederation",
        icon: "🌍",
        description: "Increases cooperation between emoji countries.",
        tier: 4,
        id: 1004,
    },

    // Helpers
    {
        ...emojiAssemblyHelperUpgrade,
        name: "Emoji interns",
        icon: "🧑‍🎓",
        description: "Interns help the emoji government run smoothly!",
        tier: 0,
        tierPosition: 0,
        id: 100000,
    },
    {
        ...emojiAssemblyHelperUpgrade,
        name: "Emoji bureaucrats",
        icon: "📎",
        description: "An emoji government needs administrators to function.",
        quote: "It looks like you're passing a law. Need help?",
        tier: 0,
        tierPosition: 1,
        id: 100001,
    },
];
