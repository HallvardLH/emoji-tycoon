import { buildingUpgrades } from "../data/upgradeData";
import { store } from '../redux/reduxStore';
import { unlockUpgrade } from "../redux/upgradesSlice";

// Get building from store shorthand
function getBuilding(name: string) {
    return store.getState().buildings.buildings[name];
}

const unlockReq = {
    0: 1,
    1: 10,
    2: 50,
    3: 100,
    4: 200,
}

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