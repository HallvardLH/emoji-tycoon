import i18n from "./index";
import { buildingData } from "../scripts/game/buildings/buildingData";
import { pluralNames, midSentence } from "../scripts/game/buildings/buildings";
import { trials } from "../scripts/game/prestige/trials";
import { formatNumber } from "../scripts/misc";
import type { TrophyText } from "../scripts/game/achievements";
import { getUpgradeDataById } from "../scripts/game/upgrades/shorthands";
import { effectData } from "../scripts/game/effects/effectData";
import { BuildingNames } from "../scripts/game/buildings/buildingNamesType";
import type { Perk } from "../scripts/game/prestige/perks";
import type { Trial } from "../scripts/game/prestige/trials";
import type { FunValueEffect } from "../scripts/game/funValues";

/**
 * Translated game content.
 *
 * The English texts stay in the game data files, which remain the source of truth.
 * Other languages provide translations in locales/<language>/content.json, keyed by id,
 * and fall back to the English text whenever a translation is missing.
 *
 * Note that English names are also used as identifiers throughout the game logic,
 * so only ever use these helpers for displaying text.
 */

function translate(key: string, english: string) {
    return i18n.t(key, { ns: "content", defaultValue: english });
}

export function getBuildingName(buildingId: number) {
    return translate(`buildings.${buildingId}.name`, buildingData[buildingId].name);
}

export function getBuildingPluralName(buildingId: number) {
    const name = buildingData[buildingId].name;
    return translate(`buildings.${buildingId}.plural`, pluralNames[name] ?? name);
}

/** The singular name for an amount of 1, otherwise the plural name */
export function getBuildingNameForAmount(buildingId: number, amount: number) {
    return amount === 1 ? getBuildingName(buildingId) : getBuildingPluralName(buildingId);
}

export function getBuildingDescription(buildingId: number) {
    return translate(`buildings.${buildingId}.description`, buildingData[buildingId].description);
}

/** Display name for the building an upgrade belongs to, including the big emoji */
export function getUpgradeBuildingName(building: BuildingNames) {
    if (building === "Big emoji") {
        return i18n.t("upgrades.bigEmoji", { ns: "ui" });
    }
    const data = buildingData.find(b => b.name === building);
    return data ? getBuildingName(data.buildingId) : building;
}

export function getUpgradeName(upgradeId: number) {
    return translate(`upgrades.${upgradeId}.name`, getUpgradeDataById(upgradeId).name);
}

export function getUpgradeDescription(upgradeId: number) {
    return translate(`upgrades.${upgradeId}.description`, getUpgradeDataById(upgradeId).description);
}

export function getUpgradeQuote(upgradeId: number) {
    const quote = getUpgradeDataById(upgradeId).quote;
    return quote ? translate(`upgrades.${upgradeId}.quote`, quote) : undefined;
}

function getEffectData(effectId: number) {
    return effectData.find(effect => effect.id === effectId);
}

export function getEffectTitle(effectId: number, fallback = "") {
    const effect = getEffectData(effectId);
    return translate(`effects.${effectId}.title`, effect ? effect.title : fallback);
}

export function getPerkName(perk: Perk) {
    return translate(`perks.${perk.id}.name`, perk.name);
}

export function getPerkDescription(perk: Perk) {
    return translate(`perks.${perk.id}.description`, perk.description);
}

export function getTrialName(trial: Trial) {
    return translate(`trials.${trial.id}.name`, trial.name);
}

/** What makes the trial's run harder */
export function getTrialRule(trial: Trial) {
    return translate(`trials.${trial.id}.rule`, trial.rule);
}

/** What completing the trial gives, forever */
export function getTrialReward(trial: Trial) {
    return translate(`trials.${trial.id}.reward`, trial.reward);
}

/**
 * A trophy's name or description, filled in for the current language: numbers in its
 * format, building names mid-sentence, and the trial's and tier's translated names
 */
export function getTrophyText(text: TrophyText) {
    const trial = text.trialId ? trials.find(t => t.id === text.trialId) : undefined;
    return i18n.t(`trophies.${text.key}`, {
        ns: "ui",
        amount: text.amount !== undefined ? formatNumber(text.amount, 0) : undefined,
        building: text.buildingId !== undefined ? getBuildingName(text.buildingId) : undefined,
        buildingMid: text.buildingId !== undefined ? midSentence(getBuildingName(text.buildingId)) : undefined,
        buildingsMid: text.buildingId !== undefined ? midSentence(getBuildingPluralName(text.buildingId)) : undefined,
        trial: trial ? getTrialName(trial) : undefined,
        tier: text.tier ? i18n.t(`trophies.tiers.${text.tier}`, { ns: "ui" }) : undefined,
    });
}

// Fun value quirks have no id, so they are keyed by where their range starts
export function getFunValueEffectName(effect: FunValueEffect) {
    return translate(`funValues.${effect.from}.name`, effect.name);
}

export function getFunValueEffectDescription(effect: FunValueEffect) {
    return translate(`funValues.${effect.from}.description`, effect.description);
}
