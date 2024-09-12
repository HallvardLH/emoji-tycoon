import { getBaseBuildingPrice } from "../../buildings/buildingData";
import { BuildingNames } from "../../buildings/buildingNamesType";

export function getBuildingUpgradePrice(tier: number, buildingId: number) {

    return Math.round((getBaseBuildingPrice(buildingId) / 2) * Math.pow(10, tier + 1))
}

export const BUILDING_UPGRADE_TIERS = [0, 1, 2, 3, 4];

export type UnlockConditionType = "Building amount" | "Building helper";

export type UpgradeCateogoriesType = "Multiply building production" | "Multiply tap" | "Percentage increase production" | "Percentage increase tap";

export type UpgradeVariantsType = "Standard building" | "Helper";

export interface UpgradeType {
    building: BuildingNames,
    buildingId: number,
    name: string,
    icon: string,
    description: string,
    quote?: string,
    price?: number,
    variant: UpgradeVariantsType,
    tier: 0 | 1 | 2 | 3 | 4,
    tierPosition?: number,
    categories: UpgradeCateogoriesType[],
    emojisPerSecondMultiplier?: number,
    emojisPerSecondPercentageIncrease?: number,
    emojisPerTapMultiplier?: number,
    emojisPerTapPercentageIncrease?: number,
    id: number,
    unlockCondition: UnlockConditionType,
}