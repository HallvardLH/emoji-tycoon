import { BuildingNames } from "../../buildings/buildingNamesType";

export type UnlockConditionType = "Building amount" | "Building helper" | "Emojis from tapping";

export type UpgradeCateogoriesType = "Multiply building production" | "Multiply tap" | "Percentage increase production" | "Percentage increase tap" | "Tap percentage of eps";

export type UpgradeVariantsType = "Standard building" | "Helper" | "Big emoji percentage";

export interface UpgradeType {
    building?: BuildingNames,
    buildingId?: number,
    name: string,
    icon: string,
    description: string,
    quote?: string,
    price?: number,
    variant: UpgradeVariantsType,
    tier: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19,
    tierPosition?: number,
    categories: UpgradeCateogoriesType[],
    emojisPerSecondMultiplier?: number,
    emojisPerSecondPercentageIncrease?: number,
    emojisPerTapMultiplier?: number,
    emojisPerTapPercentageIncrease?: number,
    emojisPerTapPercentageOfEps?: number;
    id?: number,
    unlockCondition: UnlockConditionType,
}