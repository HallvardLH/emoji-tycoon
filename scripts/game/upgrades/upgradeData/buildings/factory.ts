import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Factory upgrades
const baseFactoryUpgrade = {
    building: "Factory" as BuildingNames,
    buildingId: 5,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const factoryUpgrades: UpgradeType[] = [
    // Factory upgrades
    {
        ...baseFactoryUpgrade,
        name: "Better tools",
        icon: "🛠️",
        description: "Better tools for creating emojis faster.",
        price: getBuildingUpgradePrice(0, 4),
        tier: 0,
        id: 40,
    },
    {
        ...baseFactoryUpgrade,
        name: "More workers",
        icon: "🧑‍🏭",
        description: "Increase the amount of factory employees.",
        price: getBuildingUpgradePrice(1, 4),
        tier: 1,
        id: 41,
    },
    {
        ...baseFactoryUpgrade,
        name: "Bigger gears",
        icon: "⚙️",
        description: "Bigger gears allow for bigger machinery.",
        price: getBuildingUpgradePrice(2, 4),
        tier: 2,
        id: 42,
    },
    {
        ...baseFactoryUpgrade,
        name: "Nuts and bolts",
        icon: "🔩",
        description: "These are used to make sure everything doesn't fall apart.",
        price: getBuildingUpgradePrice(3, 4),
        tier: 3,
        id: 43,
    },
    {
        ...baseFactoryUpgrade,
        name: "Robot workers",
        icon: "🤖",
        description: "Replace weak human workers with strong android workers!",
        price: getBuildingUpgradePrice(4, 4),
        tier: 4,
        id: 44,
    },
];
