import { buildingUpgrades } from "./upgradeData";
import { store } from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade, clearNotifications } from "../../redux/upgradesSlice";
import { pluralNames, calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding } from "../shorthands";
import { updateEmojis } from "../../redux/valuesSlice";

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