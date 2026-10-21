/**
 * Checks the translations in i18n/locales for missing, outdated or broken strings.
 *
 * Usage: npm run i18n:check
 *        npm run i18n:check -- --dump-english <file>   (writes all English game content, keyed like content.json)
 *
 * - UI strings (ui.json) are compared against locales/en/ui.json
 * - Game content (content.json) is compared against the English texts in the game data files
 * - Placeholders ({{value}}) and <hl> tags must match the English string
 * - Plural strings must have every plural form the language uses, by count or by position (ordinals)
 * - Characters that the language's font cannot display are reported, see i18n/fonts.ts
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");

const opentype = require("opentype.js");

require("sucrase/register/ts");
require("sucrase/register/tsx");

// The game data is loaded straight from the TypeScript sources. Stub out the modules
// that only work inside the app, the data itself does not depend on them
const i18nIndex = path.join(__dirname, "index.ts");
// A stand-in for app-only modules: any property or call on it gives another stand-in
const stub = new Proxy(function () { }, {
    get: (target, property) => property === "__esModule" ? true : property === Symbol.toPrimitive ? () => "" : stub,
    apply: () => stub,
    construct: () => stub,
});
// Packages that run in Node; every other package is assumed to need the app and is stubbed out
const nodePackages = ["opentype.js", "sucrase", "i18next", "intl-pluralrules", "@reduxjs/toolkit", "redux"];
const originalLoad = Module._load;
Module._load = function (request, parent) {
    if (/redux\/reduxStore$/.test(request)) return { default: { getState: () => ({}), dispatch: () => { }, subscribe: () => () => { } } };
    if (!request.startsWith(".") && !request.startsWith("/") && !request.startsWith("node:")
        && !nodePackages.some(name => request === name || request.startsWith(name + "/"))
        && !Module.builtinModules.includes(request)) {
        return stub;
    }
    // Assets, like sounds and images
    if (/\.(wav|mp3|png|jpe?g|gif|webp|ttf|otf)$/.test(request)) return stub;
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
const { perks } = require(path.join(root, "scripts/game/prestige/perks.ts"));
const { trials } = require(path.join(root, "scripts/game/prestige/trials.ts"));
const { funValueEffects } = require(path.join(root, "scripts/game/funValues.ts"));
const { languageTextStyles, GAME_FONTS } = require(path.join(__dirname, "fonts.ts"));

// The font files behind the font families in fonts.ts
const fontFiles = {
    LilitaOne: require.resolve("@expo-google-fonts/lilita-one/400Regular/LilitaOne_400Regular.ttf"),
    // Every weight of Nunito the game uses covers the same characters
    Nunito: require.resolve("@expo-google-fonts/nunito/800ExtraBold/Nunito_800ExtraBold.ttf"),
    RussoOne: require.resolve("@expo-google-fonts/russo-one/400Regular/RussoOne_400Regular.ttf"),
    Baloo2: require.resolve("@expo-google-fonts/baloo-2/800ExtraBold/Baloo2_800ExtraBold.ttf"),
    BalooDa2: require.resolve("@expo-google-fonts/baloo-da-2/800ExtraBold/BalooDa2_800ExtraBold.ttf"),
    Commissioner: require.resolve("@expo-google-fonts/commissioner/900Black/Commissioner_900Black.ttf"),
    Kanit: require.resolve("@expo-google-fonts/kanit/700Bold/Kanit_700Bold.ttf"),
    Lalezar: require.resolve("@expo-google-fonts/lalezar/400Regular/Lalezar_400Regular.ttf"),
};

// Suggested replacements for common characters that fonts lack
const replacements = {
    "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u201e": '"',
    "\u2026": "...", "\u2013": "-", "\u2014": "-", "\u00a0": "a regular space", "\u202f": "a regular space",
};

// Emojis are drawn by the system's emoji font
const isEmojiPart = (character) => /\p{Extended_Pictographic}|\p{Regional_Indicator}|[\u200d\ufe0f\u20e3]|[\u{1f3fb}-\u{1f3ff}]/u.test(character);

// Plural forms, by count (e.g. "_one") or by position (e.g. "_ordinal_one", for "1st")
const PLURAL_SUFFIX = /(_ordinal)?_(zero|one|two|few|many|other)$/;

const englishContent = { buildings: {}, upgrades: {}, effects: {}, perks: {}, trials: {}, funValues: {} };
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
for (const perk of perks) {
    englishContent.perks[perk.id] = { name: perk.name, description: perk.description };
}
for (const trial of trials) {
    englishContent.trials[trial.id] = { name: trial.name, rule: trial.rule, reward: trial.reward };
}
// Fun value quirks have no id, so they are keyed by where their range starts
for (const effect of funValueEffects) {
    englishContent.funValues[effect.from] = { name: effect.name, description: effect.description };
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
const pluralCategories = (language, type = "cardinal") => new Intl.PluralRules(language, { type }).resolvedOptions().pluralCategories;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

let errorCount = 0;
let warningCount = 0;
const error = (language, message) => { errorCount++; console.log(`  [${language}] ERROR   ${message}`); };
const warning = (language, message) => { warningCount++; console.log(`  [${language}] WARNING ${message}`); };

function compare(language, file, english, translated, canDisplay) {
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
        const isOrdinal = keys.some(key => /_ordinal_[a-z]+$/.test(key));
        const translatedKeys = !isPlural ? [base]
            : isOrdinal ? pluralCategories(language, "ordinal").map(category => `${base}_ordinal_${category}`)
                : pluralCategories(language).map(category => `${base}_${category}`);
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
        for (const character of new Set(String(text))) {
            if (!canDisplay(character)) {
                const code = character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
                const hint = replacements[character] ? `, use ${replacements[character]} instead` : "";
                error(language, `${file}: "${key}" contains "${character}" (U+${code}), which the font cannot display${hint}`);
            }
        }
    }
}

const dumpIndex = process.argv.indexOf("--dump-english");
if (dumpIndex !== -1) {
    fs.writeFileSync(process.argv[dumpIndex + 1], JSON.stringify(englishContent, null, 4) + "\n");
    console.log(`Wrote the English game content to ${process.argv[dumpIndex + 1]}`);
    process.exit(0);
}

const englishUi = flatten(readJson(path.join(localesDir, "en", "ui.json")));
const englishContentFlat = flatten(englishContent);
const englishCharacters = new Set([...Object.values(englishUi), ...Object.values(englishContentFlat)].join(""));
const languages = fs.readdirSync(localesDir).filter(language => language !== "en");

const loadedFonts = {};
function displayChecker(language) {
    const style = languageTextStyles[language] || {};
    // Text may use either the display or the body font, so both have to cover it.
    // null is the system font, as used for e.g. Chinese, which covers everything
    const families = [
        style.display === undefined ? GAME_FONTS.display : style.display,
        style.body === undefined ? GAME_FONTS.body : style.body,
    ].filter(Boolean);
    const fonts = families.map(family => {
        if (!fontFiles[family]) throw new Error(`No font file for ${family}, add it to fontFiles in check.js`);
        return loadedFonts[family] ||= opentype.loadSync(fontFiles[family]);
    });
    // Characters that appear in English are fine, as they show up there too
    return (character) => character.codePointAt(0) < 0x20 || englishCharacters.has(character) || isEmojiPart(character)
        || fonts.every(font => font.charToGlyphIndex(character) > 0);
}

// The number names a language needs, which depends on whether it names every third or fourth power of ten
function withNumberNames(english, translated) {
    if (translated["numbers.groupSize"] !== "4") return english;
    const result = {};
    for (const [key, value] of Object.entries(english)) {
        if (!/^numbers\.(long|short)\./.test(key)) result[key] = value;
    }
    for (let power = 4; power <= 68; power += 4) {
        result[`numbers.long.${power}_other`] = `(name for 10^${power})`;
        result[`numbers.short.${power}`] = `(short name for 10^${power})`;
    }
    return result;
}

for (const language of languages) {
    console.log(`Checking ${language}`);
    const dir = path.join(localesDir, language);
    const canDisplay = displayChecker(language);
    for (const [file, english] of [["ui.json", englishUi], ["content.json", englishContentFlat]]) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) {
            error(language, `${file} is missing`);
            continue;
        }
        const translated = flatten(readJson(filePath));
        compare(language, file, file === "ui.json" ? withNumberNames(english, translated) : english, translated, canDisplay);
    }
}

console.log(`\n${errorCount} error(s), ${warningCount} warning(s)`);
process.exit(errorCount > 0 ? 1 : 0);
