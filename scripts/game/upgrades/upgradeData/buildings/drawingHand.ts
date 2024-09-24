import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType } from "../UpgradeType";

const baseDrawingHandUpgrade = {
    building: "Drawing hand" as BuildingNames,
    buildingId: 0,
    unlockCondition: "Building amount" as UnlockConditionType,
    variant: "Standard building" as UpgradeVariantsType,
};

export const drawingHandUpgrades: UpgradeType[] = [
    {
        ...baseDrawingHandUpgrade,
        name: "Stronger arm",
        icon: "💪",
        description: "A stronger arm makes for drawing emojis faster.",
        price: getBuildingUpgradePrice(0, 0),
        categories: ["Multiply building production", "Multiply tap"],
        emojisPerSecondMultiplier: 2,
        emojisPerTapMultiplier: 2,
        tier: 0,
        id: 0,
    },
    {
        ...baseDrawingHandUpgrade,
        name: "Flexible fingers",
        icon: "🖖",
        description: "Flexible fingers allow for more intricate emojis.",
        price: getBuildingUpgradePrice(1, 0),
        categories: ["Multiply building production", "Multiply tap"],
        emojisPerSecondMultiplier: 2,
        emojisPerTapMultiplier: 2,
        tier: 1,
        id: 1,
    },
    {
        ...baseDrawingHandUpgrade,
        name: "Two hands",
        icon: "👐",
        description: "Twice the hands, double the emojis.",
        price: getBuildingUpgradePrice(2, 0),
        categories: ["Multiply building production", "Multiply tap"],
        emojisPerSecondMultiplier: 2,
        emojisPerTapMultiplier: 2,
        tier: 2,
        id: 2,
    },
    {
        ...baseDrawingHandUpgrade,
        name: "Bionic arm",
        icon: "🦾",
        description: "Bionic arms to draw emojis super fast!",
        price: getBuildingUpgradePrice(3, 0),
        categories: ["Multiply building production", "Multiply tap"],
        emojisPerSecondMultiplier: 2,
        emojisPerTapMultiplier: 2,
        tier: 3,
        id: 3,
    },
    {
        ...baseDrawingHandUpgrade,
        name: "Tongue",
        icon: "👅",
        description: "With years of practice, you too can learn to draw with your tongue!",
        price: getBuildingUpgradePrice(4, 0),
        categories: ["Multiply building production", "Multiply tap"],
        emojisPerSecondMultiplier: 2,
        emojisPerTapMultiplier: 2,
        tier: 4,
        id: 4,
    },
]