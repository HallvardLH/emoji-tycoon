import { getBaseBuildingPrice } from "../buildings/buildingData"
import { UpgradeVariantsType } from "./upgradeData/UpgradeType";
import store from "../../redux/reduxStore";
import { roundToPrettyNumber } from "../../utils";

export function getUpgradePrice(tier: number, variant: UpgradeVariantsType, buildingId?: number, tierPosition?: number) {
    switch (variant) {
        case "Standard building":
            if (buildingId != undefined) {
                return roundToPrettyNumber(Math.round((getBaseBuildingPrice(buildingId)) * Math.pow(10, tier + 1) / 2))
            }
            break;
        case "Helper":
            if (tierPosition != undefined && buildingId) {
                const basePrice = getBaseBuildingPrice(buildingId);
                const baseExponent = 50;
                const tierScalingFactor = 10;
                const price = basePrice * Math.pow(baseExponent, tier) * (1 + tierPosition / tierScalingFactor);
                return Math.round(price);
            }
            break;
        case "Big emoji percentage":
            if (tierPosition != undefined) {
                const emojiTaps = store.getState().stats.bigEmojiTaps;
                // Price is tier position based, plus how many times you've tapped the emoji
                return Math.round(Math.pow(10, tierPosition! + 4)) + (emojiTaps * Math.pow(10, tierPosition))
            }
            break;

        default:
            return 1
    }

    return 1
}