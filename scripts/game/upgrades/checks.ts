import store from "../../redux/reduxStore";
import { getBuilding } from "../buildings/shorthands";
import { upgradeData } from "./upgradeData/upgradeData";
import { unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade, keepKnownUpgrades, addUpgrade } from "../../redux/upgradesSlice";
import { getUpgradeDataById } from "./shorthands";
import { getUpgradePrice } from "./upgradePrice";
import { COMBO_LEVEL_UNLOCK_TAPS, isComboUpgradeId } from "./upgradeData/nonBuilding/combo";
import { EFFECT_EMOJI_UNLOCK_EARNED, isEffectEmojiUpgradeId } from "./upgradeData/nonBuilding/effectEmojis";
import { canBuyUpgrades } from "../prestige/trials";

import { getBuildingUnlockRequirement } from "./requirements";
export { getBuildingUnlockRequirement };

/**
 * The building amounts between which the building's next standard upgrade is being
 * worked towards: from the tier before's requirement (0 for the first) to its own.
 * Undefined if every standard upgrade for it is already unlocked or owned.
 */
export function getNextUpgradeRange(buildingName: string) {
    const { unlocked, owned } = store.getState().upgrades;
    const nextTier = upgradeData
        .filter(upgrade => upgrade.building === buildingName && upgrade.variant === "Standard building")
        .filter(upgrade => !unlocked.includes(upgrade.id!) && !owned.includes(upgrade.id!))
        .reduce((lowest, upgrade) => Math.min(lowest, upgrade.tier), Infinity);

    if (nextTier === Infinity) return undefined;
    return {
        from: nextTier > 0 ? getBuildingUnlockRequirement(nextTier - 1) : 0,
        at: getBuildingUnlockRequirement(nextTier),
    };
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
            case "Combo taps": {
                const ownedComboTiers = state.upgrades.owned
                    .filter(isComboUpgradeId)
                    .map(id => getUpgradeDataById(id)?.tier ?? 0);
                // Saves from before Combo! existed can own combo levels without it: give it to them
                if (upgrade.tier === 0 && ownedComboTiers.length > 0) {
                    store.dispatch(addUpgrade(upgrade.id!));
                    break;
                }
                // Each combo level unlocks after enough taps, weighted by the combo they were made at,
                // and once the one before it is owned
                const hasPreviousLevel = upgrade.tier === 0 || ownedComboTiers.includes(upgrade.tier - 1);
                if (hasPreviousLevel && (state.stats.comboTaps ?? 0) >= COMBO_LEVEL_UNLOCK_TAPS[upgrade.tier]) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                }
                break;
            }
            case "Emojis earned": {
                // Each unlocks after enough emojis earned, once the one before it is owned
                const hasPrevious = upgrade.tier === 0 || state.upgrades.owned.some(id =>
                    isEffectEmojiUpgradeId(id) && getUpgradeDataById(id)?.tier === upgrade.tier - 1);
                if (hasPrevious && state.stats.emojisGained >= EFFECT_EMOJI_UNLOCK_EARNED[upgrade.tier]) {
                    store.dispatch(unlockUpgrade(upgrade.id!));
                }
                break;
            }
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
    // Bare bones (trial): nothing can be bought, so nothing is flagged
    const allowed = canBuyUpgrades();
    unlockedUpgrades.forEach(id => {
        const upgrade = getUpgradeDataById(id);
        const price = getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined)
        if (allowed && emojis >= price) {
            store.dispatch(addCanBuyUpgrade(id));
        } else {
            store.dispatch(removeCanBuyUpgrade(id));
        }
    });

}
/**
 * Drops upgrades in the save that aren't in the game anymore (ids move when buildings
 * are added in between), so nothing looks up an upgrade that doesn't exist
 *
 * Runs once at game start
 */
export function pruneUnknownUpgrades() {
    store.dispatch(keepKnownUpgrades(upgradeData.map(upgrade => upgrade.id!)));
}
