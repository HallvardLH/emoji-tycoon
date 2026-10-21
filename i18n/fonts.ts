import type { Language } from "./index";

/**
 * How text is styled per language.
 *
 * The game uses two fonts (see components/misc/theme.ts): Lilita One for titles and numbers
 * ("display"), and Nunito for body text. Languages they cannot display get fonts in a
 * similar chunky style here, loaded in app/_layout.tsx.
 * `npm run i18n:check` reports characters that a language's fonts cannot display.
 */
export interface LanguageTextStyle {
    /** Replaces Lilita One, or null for the bold system font. Left out, Lilita One is used */
    display?: string | null;
    /** Replaces the Nunito weights, or null for the bold system font. Left out, Nunito is used */
    body?: string | null;
    /** Scripts where spacing letters apart breaks how letters connect or stack */
    noLetterSpacing?: boolean;
    /** Scripts with tall letters or marks above and below, which need more line height */
    tall?: boolean;
    /** Scripts written right to left */
    rtl?: boolean;
}

/** The game's own fonts, which every language uses unless it replaces them */
export const GAME_FONTS = { display: "LilitaOne", body: "Nunito" };

// Baloo 2 is close to Lilita One, and covers the letters Lilita One lacks for e.g. Polish or Turkish
const latinExtendedDisplay: LanguageTextStyle = { display: "Baloo2" };

export const languageTextStyles: Partial<Record<Language, LanguageTextStyle>> = {
    cs: latinExtendedDisplay,
    hu: latinExtendedDisplay,
    pl: latinExtendedDisplay,
    ro: latinExtendedDisplay,
    tr: latinExtendedDisplay,
    vi: { display: "Baloo2", tall: true },
    ru: { display: "RussoOne" },
    uk: { display: "RussoOne" },
    el: { display: "Commissioner", body: "Commissioner" },
    hi: { display: "Baloo2", body: "Baloo2", noLetterSpacing: true, tall: true },
    bn: { display: "BalooDa2", body: "BalooDa2", noLetterSpacing: true, tall: true },
    th: { display: "Kanit", body: "Kanit", noLetterSpacing: true, tall: true },
    ar: { display: "Lalezar", body: "Lalezar", noLetterSpacing: true, tall: true, rtl: true },
    // Fonts covering Chinese, Japanese and Korean are several megabytes each,
    // while the system fonts for them are good on both platforms
    ja: { display: null, body: null },
    ko: { display: null, body: null },
    "zh-Hans": { display: null, body: null },
    "zh-Hant": { display: null, body: null },
};
