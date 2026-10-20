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

/**
 * To add a new language:
 * 1. Add `locales/<code>/ui.json` and `locales/<code>/content.json`
 * 2. Import them below and add the language to `resources` and `languageNames`
 * 3. If the language is not written in the Latin script, give it a font in components/generalUI/Text.tsx
 * 4. Add it to CFBundleLocalizations in app.json
 * 5. Run `npm run i18n:check` to find missing or broken strings
 */
export const supportedLanguages = ["en", "es", "de", "fr", "it", "nl", "nb", "da", "sv", "uk", "hi"] as const;
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
};

// Device language codes that should use one of the supported languages
const languageAliases: Record<string, Language> = {
    // Norwegian, and Norwegian Nynorsk, whose speakers all read Bokmål
    no: "nb",
    nn: "nb",
};

function isSupported(code: string | null | undefined): code is Language {
    return !!code && (supportedLanguages as readonly string[]).includes(code);
}

/** The first of the device's preferred languages that the game supports, or English */
export function getDeviceLanguage(): Language {
    try {
        for (const locale of getLocales()) {
            const code = locale.languageCode ? languageAliases[locale.languageCode] ?? locale.languageCode : null;
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
