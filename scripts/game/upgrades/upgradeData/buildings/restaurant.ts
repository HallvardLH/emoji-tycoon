import { UpgradeType, getBuildingUpgradePrice, UnlockConditionType, UpgradeCateogoriesType, UpgradeVariantsType } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";

// Base object for Restaurant upgrades
const baseRestaurantUpgrade = {
    building: "Restaurant" as BuildingNames,
    buildingId: 3,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const restaurantUpgrades: UpgradeType[] = [
    // Restaurant upgrades
    {
        ...baseRestaurantUpgrade,
        name: "Sharp Knives",
        icon: "🔪",
        description: "Sharper knives make chopping emojis easier.",
        price: getBuildingUpgradePrice(0, 3),
        tier: 0,
        id: 30,
    },
    {
        ...baseRestaurantUpgrade,
        name: "Non-Stick Pans",
        icon: "🍳",
        description: "Non-stick pans make cooking emoji meals faster.",
        price: getBuildingUpgradePrice(1, 3),
        tier: 1,
        id: 31,
    },
    {
        ...baseRestaurantUpgrade,
        name: "Better Ovens",
        icon: "🍞",
        description: "Ovens with better heat control cook emojis quicker.",
        price: getBuildingUpgradePrice(2, 3),
        tier: 2,
        id: 32,
    },
    {
        ...baseRestaurantUpgrade,
        name: "High-Quality Ingredients",
        icon: "🥗",
        description: "Higher quality ingredients mean tastier emojis.",
        price: getBuildingUpgradePrice(3, 3),
        tier: 3,
        id: 33,
    },
    {
        ...baseRestaurantUpgrade,
        name: "Chef's Hat",
        icon: "👨‍🍳",
        description: "Wearing a chef's hat boosts emoji cooking speed.",
        price: getBuildingUpgradePrice(4, 3),
        tier: 4,
        id: 34,
    },
];
