import store from "../../redux/reduxStore";
import { getBuilding } from "../buildings/shorthands";
import { upgradeData } from "./upgradeData/upgradeData";
import { unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade, unlockedUpgradeNotificaiton } from "../../redux/upgradesSlice";
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
    const activeTab = store.getState().tabs.activeTab;
    for (const upgrade of upgradeData) {
        const building = getBuilding(upgrade.building!);
        const state = store.getState();
        const isAlreadyUnlockedOrOwned = state.upgrades.unlocked.includes(upgrade.id!) || state.upgrades.owned.includes(upgrade.id!);
        if (isAlreadyUnlockedOrOwned) continue; // skip already unlocked upgrades
        switch (upgrade.unlockCondition) {

            case "Building amount":

                const buildingUnlockReq: UnlockReq = {
                    0: 1,
                    1: 10,
                    2: 25,
                    3: 50,
                    4: 100,
                    5: 150,
                }

                if (building.amount >= buildingUnlockReq[upgrade.tier]) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                    if (activeTab !== "Shop") {
                        console.log(upgrade.name)
                        store.dispatch(unlockedUpgradeNotificaiton());
                    }
                }
                break;
            case "Building helper":
                // Helper upgrades are unlocked for every tenth building
                if (building.amount >= ((upgrade.tier + 1) * 10) && building.amount > 0) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                    if (activeTab !== "Shop") {

                        store.dispatch(unlockedUpgradeNotificaiton());
                    }
                }
                break;
            case "Emojis from tapping":
                // Unlocks the most powerful tapping upgrades, starting at 100 emojis gained from taps
                if (store.getState().stats.emojisEarnedFromTap >= Math.pow(10, upgrade.tier + 2)) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                    if (activeTab !== "Shop") {

                        store.dispatch(unlockedUpgradeNotificaiton());
                    }
                }
                break;
        }
    }
}

export function canBuyUpgrade() {
    const emojis = store.getState().values.emojis;
    const unlockedUpgrades = store.getState().upgrades.unlocked;
    unlockedUpgrades.forEach(id => {
        const upgrade = getUpgradeDataById(id);
        const price = getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined)
        if (emojis >= price) {
            store.dispatch(addCanBuyUpgrade(id));
        } else {
            store.dispatch(removeCanBuyUpgrade(id));
        }
    });

}