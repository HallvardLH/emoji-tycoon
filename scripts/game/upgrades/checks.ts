import store from "../../redux/reduxStore";
import { getBuilding } from "../buildings/shorthands";
import { upgradeData } from "./upgradeData/upgradeData";
import { unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade } from "../../redux/upgradesSlice";
import { getUpgradeDataById } from "./shorthands";
import { getUpgradePrice } from "./upgradePrice";
import { COMBO_LEVEL_UNLOCK_TAPS } from "./upgradeData/nonBuilding/combo";

import { getBuildingUnlockRequirement } from "./requirements";
export { getBuildingUnlockRequirement };

/**
 * The building amount at which the building's next standard upgrade unlocks,
 * or undefined if every standard upgrade for it is already unlocked or owned
 */
export function getNextUpgradeRequirement(buildingName: string) {
    const { unlocked, owned } = store.getState().upgrades;
    const nextTier = upgradeData
        .filter(upgrade => upgrade.building === buildingName && upgrade.variant === "Standard building")
        .filter(upgrade => !unlocked.includes(upgrade.id!) && !owned.includes(upgrade.id!))
        .reduce((lowest, upgrade) => Math.min(lowest, upgrade.tier), Infinity);

    return nextTier === Infinity ? undefined : getBuildingUnlockRequirement(nextTier);
}

/**
 * Unlocks upgrades if the requirements are met
 *
 * Loops through every upgrade and checks whether the requirements are met.
 *
 */
export function unlockUpgrades() {
    for (const upgrade of upgradeData) {
        const building = getBuilding(upgrade.building!);
        const state = store.getState();
        const isAlreadyUnlockedOrOwned = state.upgrades.unlocked.includes(upgrade.id!) || state.upgrades.owned.includes(upgrade.id!);
        if (isAlreadyUnlockedOrOwned) continue; // skip already unlocked upgrades
        switch (upgrade.unlockCondition) {

            case "Building amount":
                if (building.amount >= getBuildingUnlockRequirement(upgrade.tier)) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                }
                break;
            case "Building helper":
                // Helper upgrades are unlocked for every tenth building
                if (building.amount >= ((upgrade.tier + 1) * 10) && building.amount > 0) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                }
                break;
            case "Combo taps":
                // Each combo level unlocks after enough taps, weighted by the combo they were made at
                if ((store.getState().stats.comboTaps ?? 0) >= COMBO_LEVEL_UNLOCK_TAPS[upgrade.tier]) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                }
                break;
            case "Emojis from tapping":
                // Unlocks the most powerful tapping upgrades, starting at 100 emojis gained from taps
                if (store.getState().stats.emojisEarnedFromTap >= Math.pow(10, upgrade.tier + 2)) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
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