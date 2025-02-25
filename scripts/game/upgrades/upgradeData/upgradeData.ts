import { drawingHandUpgrades } from "./buildings/drawingHand";
import { graphicDesignStudioUpgrades } from "./buildings/graphicDesignStudio";
import { farmUpgrades } from "./buildings/farm";
import { restaurantUpgrades } from "./buildings/restaurant";
import { pettingZooUpgrades } from "./buildings/pettingZoo";
import { factoryUpgrades } from "./buildings/factory";
import { sportsCenterUpgrades } from "./buildings/sportsCenter";
import { bankUpgrades } from "./buildings/bank";
import { emojiThemeParkUpgrades } from "./buildings/emojiThemePark";
import { emojiAssemblyUpgrades } from "./buildings/emojiAssembly";
import { spaceStationUpgrades } from "./buildings/spaceStation";
import { bigEmojiUpgrades } from "./nonBuilding/bigEmoji";
import { getBuildingIdFromName } from "../../buildings/shorthands";

import { UpgradeType } from "./UpgradeType";

/**
 * Assigns unique IDs to upgrades based on their type and position in the array.
 *
 * This function processes an array of upgrades and assigns IDs according to the following rules:
 * - For standard upgrades (variant: "Standard building"), the ID is calculated as `buildingId * 100 + array position`.
 * - For helper upgrades (variant: "Helper"), the ID is calculated as `buildingId * 10000 + array position`.
 *   Helper upgrades are always at the end of the array, and the array position resets to 0 when the first helper is encountered.
 * 
 * @param upgrades - An array of upgrades to which IDs will be assigned.
 * @param buildingId - The ID of the building associated with these upgrades, used to calculate the upgrade IDs.
 * @returns An array of upgrades with unique IDs assigned based on the specified rules.
 */
function assignIdsToUpgrades(upgrades: UpgradeType[], buildingId: number): UpgradeType[] {
    let isHelperEncountered = false;
    let standardIndex = 0;
    let helperIndex = 0;

    return upgrades.map((upgrade) => {
        if (upgrade.variant === "Helper") {
            if (!isHelperEncountered) {
                // Reset indices when the first helper is encountered
                isHelperEncountered = true;
                helperIndex = 0;
            }
            // Assign ID for helper upgrades
            const id = buildingId * 10000 + helperIndex;
            helperIndex++;
            return { ...upgrade, id };
        } else {
            // Assign ID for standard upgrades
            const id = buildingId * 100 + standardIndex;
            standardIndex++;
            return { ...upgrade, id };
        }
    });
}

// We iterate building ids by 1, as big emoji upgrades are 0 - 99, but the big emoji itself
// is not a true building, so it does not have a buildingId
export const upgradeData: UpgradeType[] = [
    ...assignIdsToUpgrades(bigEmojiUpgrades, 0),
    ...assignIdsToUpgrades(drawingHandUpgrades, getBuildingIdFromName("Drawing hand") + 1),
    ...assignIdsToUpgrades(graphicDesignStudioUpgrades, getBuildingIdFromName("Graphic design studio") + 1),
    ...assignIdsToUpgrades(farmUpgrades, getBuildingIdFromName("Farm") + 1),
    ...assignIdsToUpgrades(restaurantUpgrades, getBuildingIdFromName("Restaurant") + 1),
    ...assignIdsToUpgrades(pettingZooUpgrades, getBuildingIdFromName("Petting zoo") + 1),
    ...assignIdsToUpgrades(factoryUpgrades, getBuildingIdFromName("Factory") + 1),
    ...assignIdsToUpgrades(sportsCenterUpgrades, getBuildingIdFromName("Sports center") + 1),
    ...assignIdsToUpgrades(bankUpgrades, getBuildingIdFromName("Bank") + 1),
    ...assignIdsToUpgrades(emojiThemeParkUpgrades, getBuildingIdFromName("Emoji theme park") + 1),
    ...assignIdsToUpgrades(emojiAssemblyUpgrades, getBuildingIdFromName("Emoji assembly") + 1),
    ...assignIdsToUpgrades(spaceStationUpgrades, getBuildingIdFromName("Space station") + 1),
];