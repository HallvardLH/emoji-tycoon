import { buildingUpgrades } from "./buildingUpgradeData";
import { store } from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade, clearNotifications } from "../../redux/upgradesSlice";
import { pluralNames, calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding } from "../shorthands";
import { updateEmojis } from "../../redux/valuesSlice";
import { formatNumber } from "../../misc";

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

        // Register upgrade as owned
        store.dispatch(addUpgrade(upgradeId));

        // Recalculate eps
        calculateBuildingsEps();
    }
}

export function getEffectText(upgradeId: number) {
    const upgrade = buildingUpgrades[upgradeId];
    if (upgrade.effect == "2x building production") {
        return `${pluralNames[upgrade.building]} are twice as efficient.`
    } else {
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
    const building = store.getState().buildings.buildings[upgrade.building]
    console.log(building)
    if (upgrade.effect == "2x building production") {
        if (!percentage) {
            return formatNumber(building.eps);
        } else {
            // Calculate the percentage of the building's EPS relative to the total EPS
            const buildingPercentage = (building.eps / currentEps) * 100;
            return "(" + buildingPercentage.toFixed(2) + "%)"; // Return the percentage value as a formatted string
        }
    } else {
        return ""
    }
}