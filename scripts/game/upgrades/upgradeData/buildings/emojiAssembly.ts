import { buildingIdOf } from "../../../buildings/buildingData";
import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Emoji Assembly upgrades
const baseEmojiAssemblyUpgrade = {
    building: "Emoji assembly" as BuildingNames,
    buildingId: buildingIdOf("Emoji assembly"),
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
        quote: "May the best emoji win. The losers will be dealt with.",
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

    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji flag",
        icon: "🏳️",
        description: "Every nation, united under one flag. It's a smiley face.",
        tier: 5,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Trade agreements",
        icon: "🤝",
        description: "Emojis now flow freely across every border.",
        tier: 6,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji press",
        icon: "🗞️",
        description: "Daily headlines, written entirely in emojis.",
        tier: 7,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji peace treaty",
        icon: "🕊️",
        description: "No more emoji wars. Just production.",
        quote: "War. War never changes.",
        tier: 8,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji referendum",
        icon: "🪧",
        description: "The people have spoken: more emojis, please.",
        tier: 9,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji constitution",
        icon: "📃",
        description: "We the emojis, in order to form a more perfect production line...",
        tier: 10,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji senate",
        icon: "🪑",
        description: "A hundred seats, a hundred emojis, a hundred opinions.",
        tier: 11,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji embassy",
        icon: "🏢",
        description: "Diplomacy, but with more winking faces.",
        tier: 12,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji tax cuts",
        icon: "✂️",
        description: "More emojis for everybody!",
        tier: 13,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji census",
        icon: "📋",
        description: "Counting every emoji in the land. It's taking a while.",
        tier: 14,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji summit",
        icon: "⛰️",
        description: "World leaders meet to discuss one thing: more emojis.",
        tier: 15,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji supreme court",
        icon: "⚖️",
        description: "Rules unanimously in favour of more emojis.",
        tier: 16,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji spies",
        icon: "🕵️",
        description: "Stealing emoji secrets from rival tycoons.",
        tier: 17,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji united nations",
        icon: "🇺🇳",
        description: "Every nation working together, for emojis.",
        tier: 18,
    },
    {
        ...baseEmojiAssemblyUpgrade,
        name: "Emoji world order",
        icon: "🌐",
        description: "One planet, one government, one emoji.",
        tier: 19,
    },
    // Helpers
    {
        ...emojiAssemblyHelperUpgrade,
        name: "Emoji interns",
        icon: "🧑‍🎓",
        description: "Interns help the emoji government run smoothly!",
        tier: 0,
        id: 100000,
    },
    {
        ...emojiAssemblyHelperUpgrade,
        name: "Emoji bureaucrats",
        icon: "📎",
        description: "An emoji government needs administrators to function.",
        quote: "It looks like you're passing a law. Need help?",
        tier: 1,
        id: 100001,
    },
];
