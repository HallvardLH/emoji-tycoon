// Hermes does not ship Intl.PluralRules, which i18next relies on for plurals
import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import enUi from "./locales/en/ui.json";
import esUi from "./locales/es/ui.json";
import esContent from "./locales/es/content.json";
import deUi from "./locales/de/ui.json";
import deContent from "./locales/de/content.json";
import frUi from "./locales/fr/ui.json";
import frContent from "./locales/fr/content.json";

/**
 * To add a new language:
 * 1. Add `locales/<code>/ui.json` and `locales/<code>/content.json`
 * 2. Import them below and add the language to `resources` and `languageNames`
 * 3. Run `npm run i18n:check` to find missing or broken strings
 */
export const supportedLanguages = ["en", "es", "de", "fr"] as const;
export type Language = typeof supportedLanguages[number];
/** "system" follows the device language */
export type LanguagePreference = Language | "system";

/** Each language's name, written in that language */
export const languageNames: Record<Language, string> = {
    en: "English",
    es: "Español",
    de: "Deutsch",
    fr: "Français",
};

// English game content (building, upgrade and effect texts) lives in the game data files
// themselves, see content.ts, so English only needs the UI namespace
const resources = {
    en: { ui: enUi },
    es: { ui: esUi, content: esContent },
    de: { ui: deUi, content: deContent },
    fr: { ui: frUi, content: frContent },
};

function isSupported(code: string | null | undefined): code is Language {
    return !!code && (supportedLanguages as readonly string[]).includes(code);
}

/** The first of the device's preferred languages that the game supports, or English */
export function getDeviceLanguage(): Language {
    try {
        const match = getLocales().find(locale => isSupported(locale.languageCode));
        if (match) return match.languageCode as Language;
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
