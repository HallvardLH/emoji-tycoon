import { BuildingNames } from "../../buildings/buildingNamesType";

export type UnlockConditionType = "Building amount" | "Building helper" | "Emojis from tapping" | "Combo taps" | "Emojis earned";

export type UpgradeCateogoriesType = "Multiply building production" | "Multiply tap" | "Percentage increase production" | "Percentage increase tap" | "Tap percentage of eps" | "Combo level" | "Effect emojis";

export type UpgradeVariantsType = "Standard building" | "Helper" | "Big emoji percentage" | "Combo level" | "Effect emojis";

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
    /** Effect emoji upgrades: how much more often effect emojis appear */
    effectSpawnRateMultiplier?: number;
    /** Effect emoji upgrades: how much longer good effects last */
    effectDurationMultiplier?: number;
    id?: number,
    unlockCondition: UnlockConditionType,
}