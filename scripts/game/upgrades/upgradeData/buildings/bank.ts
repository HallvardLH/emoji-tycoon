import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Bank upgrades
const baseBankUpgrade = {
    building: "Bank" as BuildingNames,
    buildingId: 7,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const bankUpgrades: UpgradeType[] = [
    // Bank upgrades
    {
        ...baseBankUpgrade,
        name: "Piggy banks",
        icon: "🐖",
        description: "Oink oink!",
        price: getBuildingUpgradePrice(0, 5),
        tier: 0,
        id: 800,
    },
    {
        ...baseBankUpgrade,
        name: "Bigger emoji bags",
        icon: "💰",
        description: "Allows for carrying even more emojis.",
        price: getBuildingUpgradePrice(1, 5),
        tier: 1,
        id: 801,
    },
    {
        ...baseBankUpgrade,
        name: "Emoji credit cards",
        icon: "💳",
        description: "Good for spending your hard-earned emojis.",
        price: getBuildingUpgradePrice(2, 5),
        tier: 2,
        id: 802,
    },
    {
        ...baseBankUpgrade,
        name: "Investment into education",
        icon: "🎓",
        description: "Better education, better emoji-drawing skills.",
        price: getBuildingUpgradePrice(3, 5),
        tier: 3,
        id: 803,
    },
    {
        ...baseBankUpgrade,
        name: "Investment into innovation",
        icon: "💡",
        description: "More innovation, more innovative emojis.",
        price: getBuildingUpgradePrice(4, 5),
        tier: 4,
        id: 804,
    },
];
