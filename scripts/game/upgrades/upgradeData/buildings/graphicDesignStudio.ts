import { UpgradeType, getBuildingUpgradePrice, UnlockConditionType, UpgradeCateogoriesType, UpgradeVariantsType } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";

const baseGraphicDesignStudioUpgrade = {
    building: "Graphic design studio" as BuildingNames,
    buildingId: 1,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const graphicDesignStudioUpgrades: UpgradeType[] = [
    // Graphic design studio
    {
        ...baseGraphicDesignStudioUpgrade,
        name: "Improved pencils",
        icon: "✏️",
        description: "Better pencils for more detailed emojis.",
        price: getBuildingUpgradePrice(0, 1),
        tier: 0,
        id: 10,
    },
    {
        ...baseGraphicDesignStudioUpgrade,
        name: "Specialized crayons",
        icon: "🖍️",
        description: "These special crayons allow artists to access their inner child.",
        price: getBuildingUpgradePrice(1, 1),
        tier: 1,
        id: 11,
    },
    {
        ...baseGraphicDesignStudioUpgrade,
        name: "Improved brushes",
        icon: "🖌️",
        description: "Improved brushes allow for more artistic emojis.",
        price: getBuildingUpgradePrice(2, 1),
        tier: 2,
        id: 12,
    },
    {
        ...baseGraphicDesignStudioUpgrade,
        name: "Fountain pens",
        icon: "🖋️",
        description: "Allows for more distinguished emojis.",
        price: getBuildingUpgradePrice(3, 1),
        tier: 3,
        id: 13,
    },
    {
        ...baseGraphicDesignStudioUpgrade,
        name: "Rulers",
        icon: "📏",
        description: "How else would you draw a straight line?",
        price: getBuildingUpgradePrice(4, 1),
        tier: 4,
        id: 14,
    },
]