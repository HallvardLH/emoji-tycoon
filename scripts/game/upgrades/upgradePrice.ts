import { getBaseBuildingPrice } from "../buildings/buildingData"
import { UpgradeVariantsType } from "./upgradeData/helpers"

export function getUpgradePrice(tier: number, variant: UpgradeVariantsType, buildingId?: number, tierPosition?: number) {
    switch (variant) {
        case "Standard building":
            if (buildingId != undefined) {
                return Math.round((getBaseBuildingPrice(buildingId)) * Math.pow(10, tier + 1)) / 2
            }
            break;
        case "Helper":
            if (tierPosition != undefined && buildingId) {
                // return Math.pow(10, tier) * Math.round(Math.pow(10, tierPosition + 1));
                return Math.round((getBaseBuildingPrice(buildingId)) * Math.pow(2 + tier, tierPosition))
            }
            break;
        default:
            return 1
    }

    return 1
}