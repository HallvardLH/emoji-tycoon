import { upgradeData } from './upgradeData/upgradeData';
import store from '../../redux/reduxStore';
import { unlockUpgrade, addUpgrade } from "../../redux/upgradesSlice";
import { calculateBuildingsEps } from "../buildings/buildings";
import { updateBuildingValue } from "../buildings/shorthands";
import { getBuilding, getBuildingIdFromName } from "../buildings/shorthands";
import { updateEmojis } from "../../redux/valuesSlice";
import { formatNumber, formatPercentage } from "../../misc";
import { addTapMultiplier, addTapPercentage, addEmojisPerTapPercentageOfEps, setTapModifiers } from '../../redux/bigEmojiSlice';
import { calculateEpt } from "../calculations";
import { getUpgradeDataById } from './shorthands';
import { canBuyUpgrade } from './checks';
import { getUpgradePrice } from './upgradePrice';
import { addEmojisPerSecondPercentage } from '../../redux/valuesSlice';
import { previewUpgradeGains, formatGainPercentage, UpgradeChanges } from '../calculations';
import { BIG_EMOJI_BUILDING_ID } from './upgradeData/nonBuilding/bigEmoji';
import * as Haptics from "../haptics";
import i18n from "../../../i18n";
import { getBuildingPluralName } from "../../../i18n/content";
import { comboLevelOfTier } from './upgradeData/nonBuilding/combo';
import { effectEmojiUpgradeSummary } from './upgradeData/nonBuilding/effectEmojis';
import { canBuyUpgrades } from '../prestige/trials';
import { playUpgradeSound } from '../sounds';

export function buyUpgrade(upgradeId: number) {
    // Bare bones (trial): no upgrades
    if (!canBuyUpgrades()) return;
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
                case "Combo level":
                    // Owning it is the effect: the max combo counts combo level upgrades owned
                    break;
                case "Effect emojis":
                    // Owning it is the effect: effect emojis read the ones owned (effectUpgrades.ts)
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
        playUpgradeSound();
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
            case "Combo level":
                text += (upgrade.tier === 0
                    ? i18n.t("upgrades.effects.comboUnlock", { level: comboLevelOfTier(0) })
                    : i18n.t("upgrades.effects.comboLevel", { level: comboLevelOfTier(upgrade.tier) })) + "\n";
                break
            case "Effect emojis":
                text += i18n.t("upgrades.effects.effectEmojis", { summary: effectEmojiUpgradeSummary(upgrade) }) + "\n";
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

/**
 * What buying an upgrade would add right now, per second and per tap
 *
 * Previews the whole upgrade at once, so an upgrade that raises production also
 * shows what that adds to taps through the hands.
 *
 * @returns lists of bonuses, bonus percentages and whether each is to production or tapping
 */
export function getUpgradeBonus(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const { values, bigEmoji } = store.getState();
    const changes: UpgradeChanges = {};

    upgrade.categories.forEach((category) => {
        switch (category) {
            case "Multiply building production":
                if (upgrade.building && upgrade.emojisPerSecondMultiplier) {
                    const building = getBuilding(upgrade.building);
                    changes.buildingEps = building.eps * (upgrade.emojisPerSecondMultiplier - 1);
                }
                break;
            case "Multiply tap":
                changes.tapMultiplier = upgrade.emojisPerTapMultiplier;
                break;
            case "Percentage increase tap":
                changes.tapPercentage = upgrade.emojisPerTapPercentageIncrease;
                break;
            case "Tap percentage of eps":
                changes.tapPercentageOfEps = upgrade.emojisPerTapPercentageOfEps;
                break;
            case "Percentage increase production":
                changes.epsPercentage = upgrade.emojisPerSecondPercentageIncrease;
                break;
        }
    });

    const gains = previewUpgradeGains(changes);
    const bonuses: string[] = [];
    const bonusPercentages: string[] = [];
    const kinds: UpgradeBonusKind[] = [];

    // Leaves out rounding noise
    if (gains.eps > values.emojisPerSecond * 1e-9 && gains.eps > 0) {
        bonuses.push(formatNumber(gains.eps));
        bonusPercentages.push(formatGainPercentage(gains.eps, values.emojisPerSecond));
        kinds.push("production");
    }
    if (gains.ept > bigEmoji.emojisPerTap * 1e-9 && gains.ept > 0) {
        bonuses.push(formatNumber(gains.ept));
        bonusPercentages.push(formatGainPercentage(gains.ept, bigEmoji.emojisPerTap));
        kinds.push("tap");
    }

    return { bonuses, bonusPercentages, kinds }
}

/**
 * Rebuilds what upgrades add to tapping from the upgrades owned
 *
 * Buying an upgrade stores its values in the save, so when upgrade data changes,
 * saves keep the old values. Runs at game start so they pick up the current ones.
 */
export function syncTapModifiers() {
    const multipliers: number[] = [];
    const percentages: number[] = [];
    const percentagesOfEps: number[] = [];

    store.getState().upgrades.owned.forEach(id => {
        const upgrade = getUpgradeDataById(id);
        if (!upgrade) return;
        if (upgrade.categories.includes("Multiply tap") && upgrade.emojisPerTapMultiplier) multipliers.push(upgrade.emojisPerTapMultiplier);
        if (upgrade.categories.includes("Percentage increase tap") && upgrade.emojisPerTapPercentageIncrease) percentages.push(upgrade.emojisPerTapPercentageIncrease);
        if (upgrade.categories.includes("Tap percentage of eps") && upgrade.emojisPerTapPercentageOfEps) percentagesOfEps.push(upgrade.emojisPerTapPercentageOfEps);
    });

    store.dispatch(setTapModifiers({ multipliers, percentages, percentagesOfEps }));
}
