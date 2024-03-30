import { store } from "../redux/reduxStore";
import { getBuilding } from "./shorthands";
import { buildingUpgrades } from "../data/upgradeData";
import { unlockUpgrade } from "../redux/upgradesSlice";

type UnlockReq = {
    [key: number]: number;
}

const unlockReq: UnlockReq = {
    0: 1,
    1: 10,
    2: 50,
    3: 100,
    4: 200,
    // 0: 1,
    // 1: 2,
    // 2: 3,
    // 3: 4,
    // 4: 5,
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