import i18n from "./index";
import { buildingData } from "../scripts/game/buildings/buildingData";
import { pluralNames } from "../scripts/game/buildings/buildings";
import { getUpgradeDataById } from "../scripts/game/upgrades/shorthands";
import { effectData } from "../scripts/game/effects/effectData";
import { BuildingNames } from "../scripts/game/buildings/buildingNamesType";

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
