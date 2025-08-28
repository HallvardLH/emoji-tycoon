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
    tier: number,
    categories: UpgradeCateogoriesType[],
    emojisPerSecondMultiplier?: number,
    emojisPerSecondPercentageIncrease?: number,
    emojisPerTapMultiplier?: number,
    emojisPerTapPercentageIncrease?: number,
    emojisPerTapPercentageOfEps?: number;
    id?: number,
    unlockCondition: UnlockConditionType,
}