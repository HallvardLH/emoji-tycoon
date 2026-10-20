import { upgradeData } from './upgradeData/upgradeData';
import store from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade } from "../../redux/upgradesSlice";
import { calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding, getBuildingIdFromName } from "../buildings/shorthands";
import { updateEmojis } from "../../redux/valuesSlice";
import { formatNumber, formatPercentage } from "../../misc";
import { addTapMultiplier, addTapPercentage, addEmojisPerTapPercentageOfEps } from '../../redux/bigEmojiSlice';
import { calculateEpt } from "../calculations";
import { getUpgradeDataById } from './shorthands';
import { canBuyUpgrade } from './checks';
import { getUpgradePrice } from './upgradePrice';
import { addEmojisPerSecondPercentage } from '../../redux/valuesSlice';
import { calculateEpsBonus, calculateEptBonus } from '../calculations';
import { BIG_EMOJI_BUILDING_ID } from './upgradeData/nonBuilding/bigEmoji';
import * as Haptics from "expo-haptics";
import i18n from "../../../i18n";
import { getBuildingPluralName } from "../../../i18n/content";

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
                text += i18n.t("upgrades.effects.multiplyBuildingProduction", { buildings: getBuildingPluralName(upgrade.buildingId!) }) + "\n";
                break
            case "Multiply tap":
                text += i18n.t("upgrades.effects.multiplyTap") + "\n";
                break
            case "Percentage increase tap":
                text += i18n.t("upgrades.effects.percentageIncreaseTap", { percent: formatPercentage(upgrade.emojisPerTapPercentageIncrease! * 100) }) + "\n";
                break
            case 'Tap percentage of eps':
                text += i18n.t("upgrades.effects.tapPercentageOfEps", { percent: formatPercentage(upgrade.emojisPerTapPercentageOfEps! * 100) }) + "\n";
                break
            case "Percentage increase production":
                text += i18n.t("upgrades.effects.percentageIncreaseProduction", { percent: formatPercentage(upgrade.emojisPerSecondPercentageIncrease! * 100) }) + "\n";
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

export type UpgradeBonusKind = "production" | "tap";

export function getUpgradeBonus(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const currentEps = store.getState().values.emojisPerSecond;
    let bonuses: string[] = [];
    let bonusPercentages: string[] = [];
    // Whether each bonus is to emoji production or to tapping
    let kinds: UpgradeBonusKind[] = [];
    upgrade.categories.forEach((category) => {
        let bonus = 0
        switch (category) {
            case "Multiply building production": {
                const building = getBuilding(upgrade.building!);
                bonus = (building.eps * upgrade.emojisPerSecondMultiplier!) - building.eps;
                bonuses.push(formatNumber(bonus));

                bonusPercentages.push(formatPercentage((bonus / currentEps) * 100));
                kinds.push("production");
                break
            }
            case "Multiply tap": {
                const calculatedBonus = calculateEptBonus(undefined, upgrade.emojisPerTapMultiplier);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                kinds.push("tap");
                break
            }
            case "Percentage increase tap": {
                const calculatedBonus = calculateEptBonus(undefined, undefined, upgrade.emojisPerTapPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                kinds.push("tap");
                break
            }
            case 'Tap percentage of eps': {
                const calculatedBonus = calculateEptBonus(upgrade.emojisPerTapPercentageOfEps);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                kinds.push("tap");
                break
            }
            case "Percentage increase production": {
                const calculatedBonus = calculateEpsBonus(undefined, upgrade.emojisPerSecondPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                kinds.push("production");
                break
            }
            default:

        }
    })

    return { bonuses, bonusPercentages, kinds }
}