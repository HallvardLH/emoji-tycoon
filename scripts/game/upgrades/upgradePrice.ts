import { getBaseBuildingPrice, BUILDING_PRICE_GROWTH } from "../buildings/buildingData"
import { UpgradeVariantsType } from "./upgradeData/UpgradeType";
import store from "../../redux/reduxStore";
import { roundToPrettyNumber } from "../../utils";
import { COMBO_LEVEL_PRICES } from "./upgradeData/nonBuilding/combo";
import { getBuildingUnlockRequirement } from "./requirements";

// Standard upgrades cost this many times the building at their unlock amount
const STANDARD_UPGRADE_PRICE_FACTOR = 4;

export function getUpgradePrice(tier: number, variant: UpgradeVariantsType, buildingId?: number) {
    switch (variant) {
        case "Standard building":
            if (buildingId != undefined) {
                // A few times what the building costs at the amount that unlocks the upgrade,
                // so every tier is a real purchase rather than free once unlocked
                const unlockPrice = getBaseBuildingPrice(buildingId) * Math.pow(BUILDING_PRICE_GROWTH, getBuildingUnlockRequirement(tier));
                return roundToPrettyNumber(Math.round(STANDARD_UPGRADE_PRICE_FACTOR * unlockPrice));
            }
            break;
        case "Helper":
            if (buildingId) {
                // Helper upgrade price is equal to building price at the upgrade's
                // unlock amount, plus 5 buildings
                const basePrice = getBaseBuildingPrice(buildingId);
                const price = basePrice * Math.pow(BUILDING_PRICE_GROWTH, tier * 10 + 5);
                return Math.round(price);
            }
            break;
        case "Combo level":
            return COMBO_LEVEL_PRICES[tier];
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