import { getBaseBuildingPrice } from "../buildings/buildingData"
import { UpgradeVariantsType } from "./upgradeData/UpgradeType";
import store from "../../redux/reduxStore";
import { roundToPrettyNumber } from "../../utils";

export function getUpgradePrice(tier: number, variant: UpgradeVariantsType, buildingId?: number) {
    switch (variant) {
        case "Standard building":
            if (buildingId != undefined) {
                return roundToPrettyNumber(Math.round((getBaseBuildingPrice(buildingId)) * Math.pow(10, tier + 1) / 2))
            }
            break;
        case "Helper":
            if (buildingId) {
                // Helper upgrade price is equal to building price at the upgrade's
                // unlock amount, plus 5 buildings
                const basePrice = getBaseBuildingPrice(buildingId);
                const price = basePrice * Math.pow(1.175, tier * 10 + 5);
                return Math.round(price);
            }
            break;
        case "Big emoji percentage":
            const emojiTaps = store.getState().stats.bigEmojiTaps;
            // Price is tier position based, plus how many times you've tapped the emoji
            return Math.round(Math.pow(10, tier + 4)) + (emojiTaps * Math.pow(10, tier))
            break;

        default:
            return 1
    }

    return 1
}