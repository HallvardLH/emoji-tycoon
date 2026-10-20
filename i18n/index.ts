// Hermes does not ship Intl.PluralRules, which i18next relies on for plurals
import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales, Locale } from "expo-localization";

import enUi from "./locales/en/ui.json";
import esUi from "./locales/es/ui.json";
import esContent from "./locales/es/content.json";
import deUi from "./locales/de/ui.json";
import deContent from "./locales/de/content.json";
import frUi from "./locales/fr/ui.json";
import frContent from "./locales/fr/content.json";
import hiUi from "./locales/hi/ui.json";
import hiContent from "./locales/hi/content.json";
import nbUi from "./locales/nb/ui.json";
import nbContent from "./locales/nb/content.json";
import daUi from "./locales/da/ui.json";
import daContent from "./locales/da/content.json";
import svUi from "./locales/sv/ui.json";
import svContent from "./locales/sv/content.json";
import nlUi from "./locales/nl/ui.json";
import nlContent from "./locales/nl/content.json";
import itUi from "./locales/it/ui.json";
import itContent from "./locales/it/content.json";
import ukUi from "./locales/uk/ui.json";
import ukContent from "./locales/uk/content.json";
import ptUi from "./locales/pt/ui.json";
import ptContent from "./locales/pt/content.json";
import jaUi from "./locales/ja/ui.json";
import jaContent from "./locales/ja/content.json";
import koUi from "./locales/ko/ui.json";
import koContent from "./locales/ko/content.json";
import zhHansUi from "./locales/zh-Hans/ui.json";
import zhHansContent from "./locales/zh-Hans/content.json";
import zhHantUi from "./locales/zh-Hant/ui.json";
import zhHantContent from "./locales/zh-Hant/content.json";
import ruUi from "./locales/ru/ui.json";
import ruContent from "./locales/ru/content.json";
import trUi from "./locales/tr/ui.json";
import trContent from "./locales/tr/content.json";
import plUi from "./locales/pl/ui.json";
import plContent from "./locales/pl/content.json";
import idUi from "./locales/id/ui.json";
import idContent from "./locales/id/content.json";
import arUi from "./locales/ar/ui.json";
import arContent from "./locales/ar/content.json";
import viUi from "./locales/vi/ui.json";
import viContent from "./locales/vi/content.json";
import thUi from "./locales/th/ui.json";
import thContent from "./locales/th/content.json";
import csUi from "./locales/cs/ui.json";
import csContent from "./locales/cs/content.json";
import roUi from "./locales/ro/ui.json";
import roContent from "./locales/ro/content.json";
import fiUi from "./locales/fi/ui.json";
import fiContent from "./locales/fi/content.json";
import elUi from "./locales/el/ui.json";
import elContent from "./locales/el/content.json";
import huUi from "./locales/hu/ui.json";
import huContent from "./locales/hu/content.json";
import swUi from "./locales/sw/ui.json";
import swContent from "./locales/sw/content.json";
import bnUi from "./locales/bn/ui.json";
import bnContent from "./locales/bn/content.json";
import filUi from "./locales/fil/ui.json";
import filContent from "./locales/fil/content.json";

/**
 * To add a new language:
 * 1. Add `locales/<code>/ui.json` and `locales/<code>/content.json`
 * 2. Import them below and add the language to `resources` and `languageNames`
 * 3. If the game font cannot display the language, give it a font in fonts.ts (i18n:check tells you)
 * 4. Add it to CFBundleLocalizations in app.json
 * 5. Run `npm run i18n:check` to find missing or broken strings
 */
export const supportedLanguages = [
    "en", "es", "de", "fr", "it", "nl", "nb", "da", "sv", "uk", "hi",
    "pt", "ja", "ko", "zh-Hans", "zh-Hant", "ru", "tr", "pl", "id", "ar",
    "vi", "th", "cs", "ro", "fi", "el", "hu", "sw", "bn", "fil",
] as const;
export type Language = typeof supportedLanguages[number];
/** "system" follows the device language */
export type LanguagePreference = Language | "system";

/** Each language's name, written in that language */
export const languageNames: Record<Language, string> = {
    en: "English",
    es: "Español",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    nl: "Nederlands",
    nb: "Norsk",
    da: "Dansk",
    sv: "Svenska",
    uk: "Українська",
    hi: "हिन्दी",
    pt: "Português",
    ja: "日本語",
    ko: "한국어",
    "zh-Hans": "简体中文",
    "zh-Hant": "繁體中文",
    ru: "Русский",
    tr: "Türkçe",
    pl: "Polski",
    id: "Bahasa Indonesia",
    ar: "العربية",
    vi: "Tiếng Việt",
    th: "ไทย",
    cs: "Čeština",
    ro: "Română",
    fi: "Suomi",
    el: "Ελληνικά",
    hu: "Magyar",
    sw: "Kiswahili",
    bn: "বাংলা",
    fil: "Filipino",
};

// English game content (building, upgrade and effect texts) lives in the game data files
// themselves, see content.ts, so English only needs the UI namespace
const resources = {
    en: { ui: enUi },
    es: { ui: esUi, content: esContent },
    de: { ui: deUi, content: deContent },
    fr: { ui: frUi, content: frContent },
    hi: { ui: hiUi, content: hiContent },
    nb: { ui: nbUi, content: nbContent },
    da: { ui: daUi, content: daContent },
    sv: { ui: svUi, content: svContent },
    nl: { ui: nlUi, content: nlContent },
    it: { ui: itUi, content: itContent },
    uk: { ui: ukUi, content: ukContent },
    pt: { ui: ptUi, content: ptContent },
    ja: { ui: jaUi, content: jaContent },
    ko: { ui: koUi, content: koContent },
    "zh-Hans": { ui: zhHansUi, content: zhHansContent },
    "zh-Hant": { ui: zhHantUi, content: zhHantContent },
    ru: { ui: ruUi, content: ruContent },
    tr: { ui: trUi, content: trContent },
    pl: { ui: plUi, content: plContent },
    id: { ui: idUi, content: idContent },
    ar: { ui: arUi, content: arContent },
    vi: { ui: viUi, content: viContent },
    th: { ui: thUi, content: thContent },
    cs: { ui: csUi, content: csContent },
    ro: { ui: roUi, content: roContent },
    fi: { ui: fiUi, content: fiContent },
    el: { ui: elUi, content: elContent },
    hu: { ui: huUi, content: huContent },
    sw: { ui: swUi, content: swContent },
    bn: { ui: bnUi, content: bnContent },
    fil: { ui: filUi, content: filContent },
};

// Device language codes that should use one of the supported languages
const languageAliases: Record<string, Language> = {
    // Norwegian, and Norwegian Nynorsk, whose speakers all read Bokmål
    no: "nb",
    nn: "nb",
    // Older codes for Indonesian and Filipino
    in: "id",
    tl: "fil",
};

// Regions where Chinese is written with traditional characters
const traditionalChineseRegions = ["TW", "HK", "MO"];

function toSupportedCode(locale: Locale): string | null {
    const code = locale.languageCode;
    if (!code) return null;
    if (code === "zh") {
        const traditional = locale.languageScriptCode
            ? locale.languageScriptCode === "Hant"
            : traditionalChineseRegions.includes(locale.regionCode ?? "");
        return traditional ? "zh-Hant" : "zh-Hans";
    }
    return languageAliases[code] ?? code;
}

function isSupported(code: string | null | undefined): code is Language {
    return !!code && (supportedLanguages as readonly string[]).includes(code);
}

/** The first of the device's preferred languages that the game supports, or English */
export function getDeviceLanguage(): Language {
    try {
        for (const locale of getLocales()) {
            const code = toSupportedCode(locale);
            if (isSupported(code)) return code;
        }
    } catch (error) {
        console.warn("Could not read device locales", error);
    }
    return "en";
}

export function resolveLanguage(preference: LanguagePreference): Language {
    return preference === "system" ? getDeviceLanguage() : preference;
}

/** Applies a language preference, see LanguageSync in app/_layout.tsx */
export function applyLanguagePreference(preference: LanguagePreference) {
    const language = resolveLanguage(preference);
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
    }
}

/** The currently active language */
export function getLanguage(): Language {
    return isSupported(i18n.language) ? i18n.language : "en";
}

i18n.use(initReactI18next).init({
    resources,
    showSupportNotice: false,
    lng: getDeviceLanguage(),
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    ns: ["ui", "content"],
    defaultNS: "ui",
    interpolation: {
        // React already escapes rendered strings
        escapeValue: false,
    },
    react: {
        // Only allow the components passed to <Trans>, as HTML tags like <b> do not exist in React Native
        transSupportBasicHtmlNodes: false,
    },
});

export default i18n;
