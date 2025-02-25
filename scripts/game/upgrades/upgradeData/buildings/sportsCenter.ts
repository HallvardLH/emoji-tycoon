import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseSportsCenterUpgrade = {
    building: "Sports center" as BuildingNames,
    buildingId: 6,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const sportsCenterUpgrades: UpgradeType[] = [
    {
        ...baseSportsCenterUpgrade,
        name: "Basketball courts",
        icon: "🏀",
        quote: "Swish, swish, swish. Nothing but net. And their jaws just dropped to the floor.",
        description: "A reason to get together.",
        tier: 0,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Baseball fields",
        icon: "⚾",
        description: "This ought to be a total home run.",
        tier: 1,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Squash courts",
        icon: "🎾",
        description: "Is it a vegetable or a sport?",
        tier: 2,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Fresibees",
        icon: "🥏",
        description: "The Ultimate sport",
        quote: "Gee I hope no one ever thinks to combine this with golf...",
        tier: 3,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Volleyball courts",
        icon: "🏐",
        description: "The Ultimate sport",
        tier: 4,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Ping Pong tables",
        icon: "🏓",
        description: "A sport named after the sound it makes.",
        quote: "The best way to fight Communists",
        tier: 5,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Golf courts",
        icon: "⛳",
        description: "A sport where you hit a ball with a stick and drive a cool cart.",
        quote: "A presidential sport",
        tier: 6,
    },
];