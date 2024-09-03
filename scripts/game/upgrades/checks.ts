import { store } from "../../redux/reduxStore";
import { getBuilding } from "../shorthands";
import { buildingUpgrades } from "./buildingUpgradeData";
import { unlockUpgrade } from "../../redux/upgradesSlice";

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

/**
 * Unlocks upgrades if the requirements are met
 *
 * Loops through every building upgrade and checks whether there are enough buildings of that type owned to unlock the upgrade. Each building's upgrade follows the same pattern, given by unlockReq.
 *
 */
export function unlockUpgrades() {
    let i = 0;
    // Loops through the building upgrades, from the upgradeData module
    for (const upgrade of buildingUpgrades) {
        // Gets the associated building
        const building = getBuilding(upgrade.building)
        if (building.amount >= unlockReq[upgrade.tier]) {
            store.dispatch(unlockUpgrade(i))
        }
        i++;
    }
}