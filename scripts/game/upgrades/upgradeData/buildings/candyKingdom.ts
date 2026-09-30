import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseCandyKingdomUpgrade = {
    building: "Candy kingdom" as BuildingNames,
    buildingId: 11,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const candyKingdomUpgrades: UpgradeType[] = [
    {
        ...baseCandyKingdomUpgrade,
        name: "Gumdrop guards",
        icon: "🍬",
        description: "Sweet, chewy, and surprisingly well-armed.",
        tier: 0,
        id: 1200,
    },
    {
        ...baseCandyKingdomUpgrade,
        name: "Chocolate rivers",
        icon: "🍫",
        description: "Flows straight into the emoji factories. Mind the chunks.",
        quote: "Pure imagination!",
        tier: 1,
        id: 1201,
    },
    {
        ...baseCandyKingdomUpgrade,
        name: "Cupcake cottages",
        icon: "🧁",
        description: "Tiny houses with frosting roofs. The emojis love them.",
        tier: 2,
        id: 1202,
    },
    {
        ...baseCandyKingdomUpgrade,
        name: "Royal decree",
        icon: "👑",
        description: "The Candy King has spoken: more emojis!",
        tier: 3,
        id: 1203,
    },
    {
        ...baseCandyKingdomUpgrade,
        name: "Sugar rush",
        icon: "🍩",
        description: "Everyone in the kingdom is vibrating. Production doubles, and so does the heart rate.",
        quote: "Donut stop me now!",
        tier: 4,
        id: 1204,
    },
];
