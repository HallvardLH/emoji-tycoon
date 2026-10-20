import type { Language } from "./index";

/**
 * How text is styled per language.
 *
 * The game font, Digitalt, covers most Latin-script languages. Languages it cannot display
 * get a font in a similar chunky style here, loaded in components/generalUI/Text.tsx.
 * `npm run i18n:check` reports characters that a language's font cannot display.
 */
export interface LanguageTextStyle {
    /** The font family, or null for the system font (in bold) */
    fontFamily: string | null;
    /** Scripts where spacing letters apart breaks how letters connect or stack */
    noLetterSpacing?: boolean;
    /** Scripts with tall letters or marks above and below, which need more line height */
    tall?: boolean;
    /** Scripts written right to left */
    rtl?: boolean;
}

export const GAME_FONT = "Digitalt";

export const languageTextStyles: Partial<Record<Language, LanguageTextStyle>> = {
    ru: { fontFamily: "RussoOne" },
    uk: { fontFamily: "RussoOne" },
    el: { fontFamily: "Commissioner" },
    vi: { fontFamily: "Baloo2", tall: true },
    hi: { fontFamily: "Baloo2", noLetterSpacing: true, tall: true },
    bn: { fontFamily: "BalooDa2", noLetterSpacing: true, tall: true },
    th: { fontFamily: "Kanit", noLetterSpacing: true, tall: true },
    ar: { fontFamily: "Lalezar", noLetterSpacing: true, tall: true, rtl: true },
    // Fonts covering Chinese, Japanese and Korean are several megabytes each,
    // while the system fonts for them are good on both platforms
    ja: { fontFamily: null },
    ko: { fontFamily: null },
    "zh-Hans": { fontFamily: null },
    "zh-Hant": { fontFamily: null },
};
