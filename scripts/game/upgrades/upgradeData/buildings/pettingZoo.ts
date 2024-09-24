import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const basePettingZooUpgrade = {
    building: "Petting zoo" as BuildingNames,
    buildingId: 4,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const pettingZooUpgrades: UpgradeType[] = [
    {
        ...basePettingZooUpgrade,
        name: "Brooms",
        icon: "🧹",
        description: "For cleaning up after the animals when they uhh... go number two.",
        tier: 0,
        id: 90,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Trainers",
        icon: "🐕‍🦺",
        description: "Trainers teach the animals tricks, making the zoo more efficient.",
        price: getBuildingUpgradePrice(1, 6),
        tier: 1,
        id: 91,
    },
    {
        ...basePettingZooUpgrade,
        name: "Luxury Pens",
        icon: "🏠",
        description: "Upgrade the animals' homes to keep them happy and productive.",
        price: getBuildingUpgradePrice(2, 6),
        tier: 2,
        id: 92,
    },
    {
        ...basePettingZooUpgrade,
        name: "Exotic Animals",
        icon: "🦒",
        description: "Introduce rare and exotic animals to draw in larger crowds.",
        price: getBuildingUpgradePrice(3, 6),
        tier: 3,
        id: 93,
    },
    {
        ...basePettingZooUpgrade,
        name: "Zoo Mascots",
        icon: "🎭",
        description: "Friendly mascots encourage visitors, boosting overall income.",
        price: getBuildingUpgradePrice(4, 6),
        tier: 4,
        id: 94,
    },
    // Helpers
    {
        ...basePettingZooUpgrade,
        name: "Dog helper",
        icon: "🐕",
        description: "Taps your screen with its snout.",
        quote: "WOOF! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 0,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 800
    },
    {
        ...basePettingZooUpgrade,
        name: "Cat helper",
        icon: "🐈",
        description: "Tickles you with its whiskers, making you tap faster.",
        quote: "Meow! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 1,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 801
    },
    {
        ...basePettingZooUpgrade,
        name: "Duck helper",
        icon: "🦆",
        description: "Pecks you in your side with its beak, making you tap faster.",
        quote: "Quack! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 2,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 802
    },
    {
        ...basePettingZooUpgrade,
        name: "Cow helper",
        icon: "🐄",
        description: "Swings its udders into your screen, making you tap faster.",
        quote: "Moo! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 3,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 803
    },
];