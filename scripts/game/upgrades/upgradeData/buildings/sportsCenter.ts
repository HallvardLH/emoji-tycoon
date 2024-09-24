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
        quote: "Swish, swish, swish. Nothing but net. And their jaws just dropped to the floor!",
        description: "A reason to get together.",
        tier: 0,
        id: 100,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Baseball fields",
        icon: "⚾",
        description: "This ought to be a total home run.",
        tier: 1,
        id: 101,
    },
    {
        ...baseSportsCenterUpgrade,
        name: "Squash courts",
        icon: "🎾",
        description: "Is it a vegetable or a sport?",
        tier: 2,
        id: 102,
    },
];