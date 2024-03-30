import { buildingUpgrades } from "../data/upgradeData";
import { store } from '../redux/reduxStore';
import { unlockUpgrade, addUpgrade } from "../redux/upgradesSlice";
import { pluralNames, updateBuildingValue, calculateBuildingsEps, getBuilding } from "./buildings";
import { updateEmojis } from "../redux/valuesSlice";

type UnlockReq = {
    [key: number]: number;
}

const unlockReq: UnlockReq = {
    0: 1,
    1: 10,
    2: 50,
    3: 100,
    4: 200,
}

// Unlocks upgrades if the requirements are met
export function unlockUpgrades() {
    let i = 0;
    for (const upgrade of buildingUpgrades) {
        const building = getBuilding(upgrade.building)
        if (building.amount >= unlockReq[upgrade.tier]) {
            store.dispatch(unlockUpgrade(i))
        }
        i++;
    }
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

        console.log(store.getState().buildings.buildings[upgrade.building].upgrades)

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

console.log(getDisplayUpgrades("Drawing hand"));