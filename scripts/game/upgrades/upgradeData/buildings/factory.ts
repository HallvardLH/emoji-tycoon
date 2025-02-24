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
    {
        ...baseFactoryUpgrade,
        name: "Better tools",
        icon: "🛠️",
        description: "Better tools for creating emojis faster.",
        tier: 0,
        id: 600,
    },
    {
        ...baseFactoryUpgrade,
        name: "More workers",
        icon: "🧑‍🏭",
        description: "Increase the amount of factory employees.",
        tier: 1,
        id: 601,
    },
    {
        ...baseFactoryUpgrade,
        name: "Bigger gears",
        icon: "⚙️",
        description: "Bigger gears allow for bigger machinery.",
        tier: 2,
        id: 602,
    },
    {
        ...baseFactoryUpgrade,
        name: "Nuts and bolts",
        icon: "🔩",
        description: "These are used to make sure everything doesn't fall apart.",
        tier: 3,
        id: 603,
    },
    {
        ...baseFactoryUpgrade,
        name: "Robot workers",
        icon: "🤖",
        description: "Replace weak human workers with strong android workers!",
        tier: 4,
        id: 604,
    },
];
