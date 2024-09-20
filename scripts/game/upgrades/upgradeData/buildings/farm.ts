import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseFarmUpgrade = {
    building: "Farm" as BuildingNames,
    buildingId: 2,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

const farmHelperUpgrade = {
    ...baseFarmUpgrade,
    categories: ["Percentage increase production" as UpgradeCateogoriesType],
    unlockCondition: "Building helper" as UnlockConditionType,
    emojisPerSecondPercentageIncrease: 0.01,
    variant: "Helper" as UpgradeVariantsType,
};

export const farmUpgrades: UpgradeType[] = [
    // Farm upgrades
    {
        ...baseFarmUpgrade,
        name: "Farmers",
        icon: "🧑‍🌾",
        description: "What is a farm without a farmer?!",
        price: getBuildingUpgradePrice(0, 2),
        tier: 0,
        id: 20,
    },
    {
        ...baseFarmUpgrade,
        name: "Seedling",
        icon: "🌱",
        description: "Don't stop beleafing!",
        price: getBuildingUpgradePrice(1, 2),
        tier: 1,
        id: 21,
    },
    {
        ...baseFarmUpgrade,
        name: "Better tools",
        icon: "🪚",
        description: "Allows for mcuh faster farming!",
        price: getBuildingUpgradePrice(2, 2),
        tier: 2,
        id: 22,
    },
    {
        ...baseFarmUpgrade,
        name: "Tractors",
        icon: "🚜",
        description: "Makes emoji-harvesting so much easier.",
        price: getBuildingUpgradePrice(3, 2),
        tier: 3,
        id: 23,
    },
    {
        ...baseFarmUpgrade,
        name: "Emoji cows",
        icon: "🐄",
        description: "Creates more emooooooojis.",
        price: getBuildingUpgradePrice(4, 2),
        tier: 4,
        id: 24,
    },

    {
        ...farmHelperUpgrade,
        name: "Potatoes",
        icon: "🥔",
        description: "Expand production with potatoes!",
        variant: "Helper",
        tier: 0,
        tierPosition: 0,
        id: 900
    },
    {
        ...farmHelperUpgrade,
        name: "Carrots",
        icon: "🥕",
        description: "Expand production with carrots!",
        variant: "Helper",
        tier: 0,
        tierPosition: 1,
        id: 901
    },
    {
        ...farmHelperUpgrade,
        name: "Cucumbers",
        icon: "🥒",
        description: "Expand production with cucumbers!",
        quote: "I'm pickle Rick!",
        variant: "Helper",
        tier: 0,
        tierPosition: 2,
        id: 902
    },
    {
        ...farmHelperUpgrade,
        name: "Bell peppers",
        icon: "🫑",
        description: "Expand production with bell peppers!",
        quote: "No point ringing this...",
        variant: "Helper",
        tier: 0,
        tierPosition: 3,
        id: 903
    },
    {
        ...farmHelperUpgrade,
        name: "Tomatos",
        icon: "🍅",
        description: "Expand production with tomatos!",
        variant: "Helper",
        tier: 0,
        tierPosition: 4,
        id: 904
    },
    {
        ...farmHelperUpgrade,
        name: "Lettuce",
        icon: "🥬",
        description: "Expand production with lettuce!",
        variant: "Helper",
        tier: 0,
        tierPosition: 5,
        id: 905
    },
    {
        ...farmHelperUpgrade,
        name: "Broccoli",
        icon: "🥦",
        description: "Expand production with broccoli!",
        quote: "Don't tell Broccoli Rob.",
        variant: "Helper",
        tier: 0,
        tierPosition: 6,
        id: 906
    },
    {
        ...farmHelperUpgrade,
        name: "Onions",
        icon: "🧅",
        description: "Expand production with onions!",
        quote: "Ogres are like onions. Onions have layers. Ogres have layers",
        variant: "Helper",
        tier: 0,
        tierPosition: 7,
        id: 907
    },
    {
        ...farmHelperUpgrade,
        name: "Garlic",
        icon: "🧄",
        description: "Expand production with garlic!",
        quote: "Works great if you have a witch-problem!",
        variant: "Helper",
        tier: 0,
        tierPosition: 8,
        id: 908
    },
    {
        ...farmHelperUpgrade,
        name: "Corn",
        icon: "🌽",
        description: "Expand production with corn!",
        variant: "Helper",
        tier: 0,
        tierPosition: 9,
        id: 909
    },
    // Tier 2
    {
        ...farmHelperUpgrade,
        name: "Beans",
        icon: "🫘",
        description: "Expand production with beans!",
        quote: "Beans!",
        variant: "Helper",
        emojisPerSecondPercentageIncrease: 0.02,
        tier: 1,
        tierPosition: 0,
        id: 910
    },
    {
        ...farmHelperUpgrade,
        name: "Peanuts",
        icon: "🥜",
        description: "Expand production with peanuts!",
        quote: "Jimmy Carter's favorite.",
        variant: "Helper",
        emojisPerSecondPercentageIncrease: 0.02,
        tier: 1,
        tierPosition: 1,
        id: 911
    },
];
