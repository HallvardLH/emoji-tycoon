import { getBaseBuildingPrice } from "../../buildings/buildingData";

export function getBuildingUpgradePrice(tier: number, buildingId: number) {

    return Math.round((getBaseBuildingPrice(buildingId) / 2) * Math.pow(10, tier + 1))
}

export const BUILDING_UPGRADE_TIERS = [0, 1, 2, 3, 4];