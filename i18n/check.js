/**
 * Checks the translations in i18n/locales for missing, outdated or broken strings.
 *
 * Usage: npm run i18n:check
 *
 * - UI strings (ui.json) are compared against locales/en/ui.json
 * - Game content (content.json) is compared against the English texts in the game data files
 * - Placeholders ({{value}}) and <hl> tags must match the English string
 * - Plural strings must have every plural form the language uses
 * - Characters that the game font (Digitalt) cannot display are reported
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");

require("sucrase/register/ts");

// The game data is loaded straight from the TypeScript sources. Stub out the modules
// that only work inside the app, the data itself does not depend on them
const i18nIndex = path.join(__dirname, "index.ts");
const originalLoad = Module._load;
Module._load = function (request, parent) {
    if (request === "expo-haptics") return { ImpactFeedbackStyle: {}, NotificationFeedbackType: {} };
    if (/redux\/reduxStore$/.test(request)) return { default: { getState: () => ({}), dispatch: () => { } } };
    // The i18n setup itself loads every locale file, which may be missing or broken
    if (request.startsWith(".") && Module._resolveFilename(request, parent) === i18nIndex) {
        return { default: { t: (key) => key }, getLanguage: () => "en" };
    }
    return originalLoad.apply(this, arguments);
};

const root = path.join(__dirname, "..");
const localesDir = path.join(__dirname, "locales");
const { buildingData } = require(path.join(root, "scripts/game/buildings/buildingData.ts"));
const { pluralNames } = require(path.join(root, "scripts/game/buildings/buildings.ts"));
const { upgradeData } = require(path.join(root, "scripts/game/upgrades/upgradeData/upgradeData.ts"));
const { effectData } = require(path.join(root, "scripts/game/effects/effectData.ts"));

// Glyphs missing from the game font, along with what to use instead
const unsupportedCharacters = {
    "‘": "'", "’": "'", "“": '"', "”": '"', "„": '"',
    "…": "...", "–": "-", "—": "-", " ": "a regular space", " ": "a regular space",
};

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const englishContent = { buildings: {}, upgrades: {}, effects: {} };
for (const building of buildingData) {
    englishContent.buildings[building.buildingId] = {
        name: building.name,
        plural: pluralNames[building.name],
        description: building.description,
    };
}
for (const upgrade of upgradeData) {
    englishContent.upgrades[upgrade.id] = { name: upgrade.name, description: upgrade.description };
    if (upgrade.quote) englishContent.upgrades[upgrade.id].quote = upgrade.quote;
}
for (const effect of effectData) {
    englishContent.effects[effect.id] = { title: effect.title, description: effect.description };
}

function flatten(object, prefix = "", result = {}) {
    for (const [key, value] of Object.entries(object)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object") flatten(value, fullKey, result);
        else result[fullKey] = value;
    }
    return result;
}

const placeholders = (text) => (String(text).match(/{{\s*[\w.]+\s*}}|<\/?\w+\s*\/?>/g) || []).map(p => p.replace(/\s/g, "")).sort().join(" ");

// The plural forms a language needs, e.g. one and other for English, or one, few, many and other for Ukrainian
const pluralCategories = (language) => new Intl.PluralRules(language).resolvedOptions().pluralCategories;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

let errorCount = 0;
let warningCount = 0;
const error = (language, message) => { errorCount++; console.log(`  [${language}] ERROR   ${message}`); };
const warning = (language, message) => { warningCount++; console.log(`  [${language}] WARNING ${message}`); };

function compare(language, file, english, translated) {
    const englishByBase = {};
    for (const key of Object.keys(english)) {
        (englishByBase[key.replace(PLURAL_SUFFIX, "")] ||= []).push(key);
    }
    const translatedBases = new Set(Object.keys(translated).map(key => key.replace(PLURAL_SUFFIX, "")));

    for (const [base, keys] of Object.entries(englishByBase)) {
        if (!translatedBases.has(base)) {
            warning(language, `${file}: missing "${base}" (English: "${english[keys[0]]}")`);
            continue;
        }
        const isPlural = keys.some(key => PLURAL_SUFFIX.test(key));
        const translatedKeys = isPlural ? pluralCategories(language).map(category => `${base}_${category}`) : [base];
        for (const key of translatedKeys) {
            if (!(key in translated)) {
                error(language, `${file}: missing plural form "${key}"`);
                continue;
            }
            const englishText = english[keys.includes(key) ? key : keys[keys.length - 1]];
            if (placeholders(translated[key]) !== placeholders(englishText)) {
                error(language, `${file}: "${key}" should contain [${placeholders(englishText)}] but has [${placeholders(translated[key])}]`);
            }
        }
    }

    for (const [key, text] of Object.entries(translated)) {
        if (!englishByBase[key.replace(PLURAL_SUFFIX, "")]) {
            warning(language, `${file}: "${key}" no longer exists in English and can be removed`);
        }
        for (const [character, replacement] of Object.entries(unsupportedCharacters)) {
            if (String(text).includes(character)) {
                error(language, `${file}: "${key}" contains U+${character.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}, which the game font cannot display, use ${replacement} instead`);
            }
        }
    }
}

const englishUi = flatten(readJson(path.join(localesDir, "en", "ui.json")));
const languages = fs.readdirSync(localesDir).filter(language => language !== "en");

for (const language of languages) {
    console.log(`Checking ${language}`);
    const dir = path.join(localesDir, language);
    for (const [file, english] of [["ui.json", englishUi], ["content.json", flatten(englishContent)]]) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) {
            error(language, `${file} is missing`);
            continue;
        }
        compare(language, file, english, flatten(readJson(filePath)));
    }
}

console.log(`\n${errorCount} error(s), ${warningCount} warning(s)`);
process.exit(errorCount > 0 ? 1 : 0);
