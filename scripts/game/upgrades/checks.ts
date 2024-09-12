import { store } from "../../redux/reduxStore";
import { getBuilding } from "../buildings/shorthands";
import { upgradeData } from "./upgradeData/upgradeData";
import { unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade } from "../../redux/upgradesSlice";
import { getUpgradeDataById } from "./shorthands";
import { getUpgradePrice } from "./upgradePrice";

type UnlockReq = {
    [key: number]: number;
}

/**
 * Unlocks upgrades if the requirements are met
 *
 * Loops through every upgrade and checks whether the requirements are met.
 *
 */
export function unlockUpgrades() {
    let i = 0;
    for (const upgrade of upgradeData) {
        const building = getBuilding(upgrade.building!)
        switch (upgrade.unlockCondition) {

            case "Building amount":

                const buildingUnlockReq: UnlockReq = {
                    0: 1,
                    1: 10,
                    2: 25,
                    3: 50,
                    4: 100,
                }

                if (building.amount >= buildingUnlockReq[upgrade.tier]) {
                    store.dispatch(unlockUpgrade(upgrade.id));
                }
                break;
            case "Building helper":
                // const helperUnlockReq: UnlockReq = {
                //     0: 1,
                //     1: 20,
                //     2: 30,
                //     3: 40,
                //     4: 50,
                // }
                // Upgrades are unlocked for every tenth building, unless there are no more in that tier, then it waits until the next 100
                // For example, tier 0 ugrades are unlocked between 1 - 100 buildings
                // Tier 1 is 101 - 200 etc.
                if (building.amount >= (upgrade.tier * 100) + (upgrade.tierPosition! * 10) && building.amount > 0) {
                    store.dispatch(unlockUpgrade(upgrade.id));
                }
        }
        i++;
    }
}

export function canBuyUpgrade() {
    const emojis = store.getState().values.emojis;
    const unlockedUpgrades = store.getState().upgrades.unlocked;
    unlockedUpgrades.forEach(id => {
        const upgrade = getUpgradeDataById(id);
        const price = getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined, upgrade.tierPosition)
        if (emojis >= price) {
            store.dispatch(addCanBuyUpgrade(id));
        } else {
            store.dispatch(removeCanBuyUpgrade(id));
        }
    });

}