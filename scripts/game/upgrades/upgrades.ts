import { upgradeData } from './upgradeData/upgradeData';
import store from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade } from "../../redux/upgradesSlice";
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
import { calculateEpsBonus, calculateEptBonus } from '../calculations';
import { BIG_EMOJI_BUILDING_ID } from './upgradeData/nonBuilding/bigEmoji';
import * as Haptics from "expo-haptics";

export function buyUpgrade(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const emojis = store.getState().values.emojis;
    const price = getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined)
    if (emojis >= price) {

        store.dispatch(updateEmojis(emojis - price));

        if (upgrade.building && upgrade.buildingId) {
            // Increment upgrades owned by building
            if (upgrade.buildingId != BIG_EMOJI_BUILDING_ID) {
                updateBuildingValue(upgrade.buildingId, "upgrades", getBuilding(upgrade.building).upgrades + 1);
            }
        }
        upgrade.categories.forEach((category) => {
            switch (category) {
                case "Multiply building production":
                    if (upgrade.building && upgrade.buildingId != undefined && upgrade.emojisPerSecondMultiplier) {
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

        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
    }
}

export function getEffectText(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    let text: string = "";
    upgrade.categories.forEach((category) => {
        switch (category) {
            case "Multiply building production":
                text += `\u2022 ${pluralNames[upgrade.building!]} are twice as efficient.\n`;
                break
            case "Multiply tap":
                text += `\u2022 Tapping is twice as efficient.\n`;
                break
            case "Percentage increase tap":
                text += `\u2022 Tapping is ${upgrade.emojisPerTapPercentageIncrease! * 100}% more powerful.\n`
                break
            case 'Tap percentage of eps':
                text += `\u2022 Tapping gains ${upgrade.emojisPerTapPercentageOfEps! * 100}% of your total emoji production.\n`
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
    let prefixes: string[] = [];
    let suffixes: string[] = [];

    const productionPrefix = "Buying this upgrade now will add";
    const productionSuffix = "Emojis per second, increasing emoji production by";

    const tapPrefix = "Buying this upgrade now will add";
    const tapSuffix = "Emojis per tap, increasing each emoji you get from tapping by";
    upgrade.categories.forEach((category) => {
        let bonus = 0
        switch (category) {
            case "Multiply building production": {
                const building = getBuilding(upgrade.building!);
                bonus = (building.eps * upgrade.emojisPerSecondMultiplier!) - building.eps;
                bonuses.push(formatNumber(bonus));

                const bonusPercentage = (bonus / currentEps) * 100;
                if (bonusPercentage < 0.01) {
                    bonusPercentages.push("(>0.01%)");
                } else {
                    bonusPercentages.push(bonusPercentage.toFixed(2) + "%");
                }
                prefixes.push(productionPrefix);
                suffixes.push(productionSuffix);
                break
            }
            case "Multiply tap": {
                const calculatedBonus = calculateEptBonus(undefined, upgrade.emojisPerTapMultiplier);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                prefixes.push(tapPrefix);
                suffixes.push(tapSuffix);
                break
            }
            case "Percentage increase tap": {
                const calculatedBonus = calculateEptBonus(undefined, undefined, upgrade.emojisPerTapPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                prefixes.push(tapPrefix);
                suffixes.push(tapSuffix);
                break
            }
            case 'Tap percentage of eps': {
                const calculatedBonus = calculateEptBonus(upgrade.emojisPerTapPercentageOfEps);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                prefixes.push(tapPrefix);
                suffixes.push(tapSuffix);
                break
            }
            case "Percentage increase production": {
                const calculatedBonus = calculateEpsBonus(undefined, upgrade.emojisPerSecondPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                prefixes.push(productionPrefix);
                suffixes.push(productionSuffix);
                break
            }
            default:

        }
    })

    return [bonuses, bonusPercentages, prefixes, suffixes]
}