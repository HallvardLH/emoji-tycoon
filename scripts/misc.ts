import i18n, { getLanguage } from "../i18n";

export function formatNumber(
    num: number,
    decimals: number = 2,
    shortForm: boolean = false
) {
    const round = (num: number) =>
        Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

    const form: "compact" | "grouped" | "space" = "grouped"; // Set the form here

    const formatWithSeparators = (n: number) => {
        if (form === "grouped") {
            // Grouping and decimal separators follow the current language
            return toDisplayableNumber(n.toLocaleString(getLanguage()));
        } else if (form === "space") {
            return n.toLocaleString("en-US").replace(/,/g, " "); // Space grouping
        } else {
            return n.toString(); // Compact form, no separators
        }
    };

    // Number names differ between languages, both in what they are called and where they start.
    // Most languages name every third power of ten from a million (though "billion" is 10^9 in English,
    // but 10^12 in most of Europe), while Chinese, Japanese and Korean name every fourth (万, 億, 兆...).
    // The names are looked up per language, and pluralized based on the number in front of them
    const powers = getNumberNamePowers();

    const withName = (n: number, power: number) => {
        const value = round(n);
        const name = shortForm
            ? i18n.t(`numbers.short.${power}`, { ns: "ui" })
            : i18n.t(`numbers.long.${power}`, { ns: "ui", count: value });
        return i18n.t("numbers.named", { ns: "ui", value: formatWithSeparators(value), name });
    };

    if (num < Math.pow(10, powers[0])) {
        return formatWithSeparators(round(num));
    }
    // The largest named power that fits, using the largest name for anything bigger
    let power = powers[0];
    for (const p of powers) {
        if (num >= Math.pow(10, p)) power = p;
    }
    return withName(num / Math.pow(10, power), power);
}

/** The powers of ten that have a name in the current language, e.g. 6 for million */
export function getNumberNamePowers() {
    const groupSize = Number(i18n.t("numbers.groupSize", { ns: "ui" })) === 4 ? 4 : 3;
    return groupSize === 4
        // 10^4 (万) to 10^68
        ? Array.from({ length: 17 }, (_, i) => 4 + i * 4)
        // 10^6 (million) to 10^63
        : Array.from({ length: 20 }, (_, i) => 6 + i * 3);
}

// Native digits (e.g. Arabic-Indic or Bengali), from their zero
const nativeDigitZeros = [0x0660, 0x06f0, 0x0966, 0x09e6, 0x0e50];

/**
 * Makes a localized number displayable by every font in the game:
 * Western digits, as is common in games, and regular spaces instead of non-breaking ones
 */
function toDisplayableNumber(text: string) {
    return text
        .replace(/[\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0e50-\u0e59]/g, (digit) => {
            const code = digit.charCodeAt(0);
            const zero = nativeDigitZeros.find(z => code >= z && code <= z + 9)!;
            return String(code - zero);
        })
        // Arabic thousands and decimal separators, and the Arabic letter mark
        .replace(/\u066c/g, ",")
        .replace(/\u066b/g, ".")
        .replace(/\u061c/g, "")
        .replace(/[\u00a0\u202f]/g, " ");
}

/**
 * Formats a percentage in the current language, e.g. "12.5%" or "12,5 %".
 * Values below 0.01 are shown as "<0.01%".
 */
export function formatPercentage(percentage: number) {
    const percent = (value: number) => i18n.t("numbers.percent", { ns: "ui", value: formatNumber(value) });
    if (percentage < 0.01) {
        return i18n.t("numbers.lessThan", { ns: "ui", value: percent(0.01) });
    }
    return percent(percentage);
}
