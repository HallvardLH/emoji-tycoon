import { upgradeData } from './upgradeData/upgradeData';
import { store } from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade, clearNotifications } from "../../redux/upgradesSlice";
import { pluralNames, calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding, getBuildingIdFromName } from "../buildings/shorthands";
import { updateEmojis } from "../../redux/valuesSlice";
import { formatNumber } from "../../misc";
import { addTapMultiplier, addTapPercentage, addEmojisPerTapPercentageOfEps } from '../../redux/bigEmojiSlice';
import { calculateEpt } from "../calculations";
import { getUpgradeDataById } from './shorthands';
import { canBuyUpgrade } from './checks';
import { getUpgradePrice } from './upgradePrice';
import { addEmojisPerSecondPercentage } from '../../redux/valuesSlice';
import { calculateEpsBonus } from '../calculations';

export function clearUpgradeNotifications() {
    store.dispatch(clearNotifications());
}

export function buyUpgrade(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const emojis = store.getState().values.emojis;
    const price = getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined, upgrade.tierPosition)
    if (emojis >= price) {

        store.dispatch(updateEmojis(emojis - price));

        if (upgrade.building && upgrade.buildingId) {
            // Increment upgrades owned by building
            if (upgrade.buildingId != 1000) {
                updateBuildingValue(upgrade.buildingId, "upgrades", getBuilding(upgrade.building).upgrades + 1);
            }
        }
        upgrade.categories.forEach((category) => {
            switch (category) {
                case "Multiply building production":
                    if (upgrade.building && upgrade.buildingId && upgrade.emojisPerSecondMultiplier) {
                        updateBuildingValue(upgrade.buildingId, "epsMultipliers", upgrade.emojisPerSecondMultiplier);
                    }
                    break;
                case "Multiply tap":
                    if (upgrade.emojisPerTapMultiplier) {
                        store.dispatch(addTapMultiplier(upgrade.emojisPerTapMultiplier));
                    }
                    break;
                case "Percentage increase tap":
                    if (upgrade.emojisPerTapPercentageIncrease) {
                        store.dispatch(addTapPercentage(upgrade.emojisPerTapPercentageIncrease));
                    }
                    break;
                case "Percentage increase production":
                    if (upgrade.emojisPerSecondPercentageIncrease) {
                        store.dispatch(addEmojisPerSecondPercentage(upgrade.emojisPerSecondPercentageIncrease));
                    }
                    break;
                case 'Tap percentage of eps':
                    if (upgrade.emojisPerTapPercentageOfEps) {
                        store.dispatch(addEmojisPerTapPercentageOfEps(upgrade.emojisPerTapPercentageOfEps));
                    }
                    break;
                default:
                    console.warn(`No action for category: ${category}`);
                    break;
            }
        });


        // Register upgrade as owned
        store.dispatch(addUpgrade(upgradeId));

        // Recalculate eps and ept
        calculateBuildingsEps();
        calculateEpt();
        canBuyUpgrade();
    }
}

export function getEffectText(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    let text: string = "";
    upgrade.categories.forEach((category) => {
        switch (category) {
            case "Multiply building production":
                text += `\u2022 ${pluralNames[upgrade.building!]} are twice as effective.\n`;
                break
            case "Multiply tap":
                text += `\u2022 Tapping is twice as efficient.\n`;
                break
            case "Percentage increase production":
                text += `\u2022 Total emoji production increased by ${upgrade.emojisPerSecondPercentageIncrease! * 100}%.\n`;
                break
            default:
                return ""
        }
    })
    return text.trim();
}

export function getDisplayUpgrades(buildingName: string) {
    let upgradeArray: string[] = [];
    let i = 0;
    const ownedUpgrades = store.getState().upgrades.owned;
    for (const upgrade of upgradeData) {
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

export function getUpgradeBonus(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const currentEps = store.getState().values.emojisPerSecond;
    let bonuses: string[] = [];
    let bonusPercentages: string[] = [];
    upgrade.categories.forEach((category) => {
        let bonus = 0
        switch (category) {
            case "Multiply building production":
                const building = getBuilding(upgrade.building!);
                bonus = (building.eps * upgrade.emojisPerSecondMultiplier!) - building.eps;
                bonuses.push(formatNumber(bonus));

                const bonusPercentage = (bonus / currentEps) * 100;
                if (bonusPercentage < 0.01) {
                    bonusPercentages.push("(>0.01%)");
                } else {
                    bonusPercentages.push("(" + bonusPercentage.toFixed(2) + "%)");
                }
                break
            case "Multiply tap":

                break

            case "Percentage increase production":
                const calculatedBonus = calculateEpsBonus(undefined, upgrade.emojisPerSecondPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
            default:

        }
    })

    return [bonuses, bonusPercentages]
}