import { buildingUpgrades } from "./buildingUpgradeData";
import { store } from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade, clearNotifications } from "../../redux/upgradesSlice";
import { pluralNames, calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding } from "../shorthands";
import { updateEmojis } from "../../redux/valuesSlice";
import { formatNumber } from "../../misc";
import { updateEptMult } from '../../redux/bigEmojiSlice';
import { calculateEpt } from "../checks";

export function clearUpgradeNotifications() {
    store.dispatch(clearNotifications());
}

export function buyUpgrade(upgradeId: number) {
    const upgrade = buildingUpgrades[upgradeId];
    const emojis = store.getState().values.emojis;
    if (emojis >= upgrade.price) {
        store.dispatch(updateEmojis(emojis - upgrade.price));

        // Increment upgrades owned by building
        updateBuildingValue(upgrade.building, "upgrades", getBuilding(upgrade.building).upgrades + 1);
        switch (upgrade.effect) {
            case "2x building production":
                updateBuildingValue(upgrade.building, "epsMultiplier", getBuilding(upgrade.building).epsMultiplier + 1);
                break
            case "2x building production and tap":
                updateBuildingValue(upgrade.building, "epsMultiplier", getBuilding(upgrade.building).epsMultiplier + 1);
                store.dispatch(updateEptMult(store.getState().bigEmoji.eptMult + 1));
                break
        }


        // Register upgrade as owned
        store.dispatch(addUpgrade(upgradeId));

        // Recalculate eps and ept
        calculateBuildingsEps();
        calculateEpt();
    }
}

export function getEffectText(upgradeId: number) {
    const upgrade = buildingUpgrades[upgradeId];
    switch (upgrade.effect) {
        case "2x building production":
            return `${pluralNames[upgrade.building]} are twice as efficient.`;
            break
        case "2x building production and tap":
            return `${pluralNames[upgrade.building]} and tapping are twice as efficient.`;
            break
        default:
            return ""
    }
}

export function getDisplayUpgrades(buildingName: string) {
    let upgradeArray: string[] = [];
    let i = 0;
    const ownedUpgrades = store.getState().upgrades.owned;
    for (const upgrade of buildingUpgrades) {
        if (upgrade.building == buildingName) {
            if (ownedUpgrades.includes(i)) {
                upgradeArray.push(upgrade.icon)
            } else {
                // Icon looked kind of ugly
                // upgradeArray.push("❓");
            }
        }
        i++;
    }

    return upgradeArray
}

export function getUpgradeBonus(upgradeId: number, percentage?: boolean) {
    const upgrade = buildingUpgrades[upgradeId];
    const currentEps = store.getState().values.eps;
    const building = store.getState().buildings.buildings[upgrade.building];
    if (upgrade.effect == "2x building production" || upgrade.effect == "2x building production and tap") {
        if (!percentage) {
            return formatNumber(building.eps);
        } else {
            // Calculate the percentage of the building's EPS relative to the total EPS
            const buildingPercentage = (building.eps / currentEps) * 100;
            if (buildingPercentage < 0.01) {
                return "(>0.01%)"
            }
            return "(" + buildingPercentage.toFixed(2) + "%)"; // Return the percentage value as a formatted string
        }
    } else {
        return ""
    }
}