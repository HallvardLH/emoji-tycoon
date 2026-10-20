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
            // Grouping and decimal separators follow the current language.
            // The game font has no non-breaking spaces (used by e.g. French), so use regular spaces instead
            return n.toLocaleString(getLanguage()).replace(/[\u00a0\u202f]/g, " ");
        } else if (form === "space") {
            return n.toLocaleString("en-US").replace(/,/g, " "); // Space grouping
        } else {
            return n.toString(); // Compact form, no separators
        }
    };

    // Number names differ between languages (e.g. "billion" is 10^9 in English, but 10^12 in most of Europe),
    // so they are looked up per language, and pluralized based on the number in front of them
    const getSuffix = (power: number, value: number) => {
        if (shortForm) {
            return " " + i18n.t(`numbers.short.${power}`, { ns: "ui" });
        } else {
            return " " + i18n.t(`numbers.long.${power}`, { ns: "ui", count: value });
        }
    };

    const withSuffix = (n: number, power: number) => formatWithSeparators(round(n)) + getSuffix(power, round(n));

    if (num < 1e3) {
        return formatWithSeparators(round(num));
    } else if (num < 1e6) {
        return formatWithSeparators(round(num));
    } else if (num < 1e9) {
        return withSuffix(num / 1e6, 6);
    } else if (num < 1e12) {
        return withSuffix(num / 1e9, 9);
    } else if (num < 1e15) {
        return withSuffix(num / 1e12, 12);
    } else if (num < 1e18) {
        return withSuffix(num / 1e15, 15);
    } else if (num < 1e21) {
        return withSuffix(num / 1e18, 18);
    } else if (num < 1e24) {
        return withSuffix(num / 1e21, 21);
    } else if (num < 1e27) {
        return withSuffix(num / 1e24, 24);
    } else if (num < 1e30) {
        return withSuffix(num / 1e27, 27);
    } else if (num < 1e33) {
        return withSuffix(num / 1e30, 30);
    } else if (num < 1e36) {
        return withSuffix(num / 1e33, 33);
    } else if (num < 1e39) {
        return withSuffix(num / 1e36, 36);
    } else if (num < 1e42) {
        return withSuffix(num / 1e39, 39);
    } else if (num < 1e45) {
        return withSuffix(num / 1e42, 42);
    } else if (num < 1e48) {
        return withSuffix(num / 1e45, 45);
    } else if (num < 1e51) {
        return withSuffix(num / 1e48, 48);
    } else if (num < 1e54) {
        return withSuffix(num / 1e51, 51);
    } else if (num < 1e57) {
        return withSuffix(num / 1e54, 54);
    } else if (num < 1e60) {
        return withSuffix(num / 1e57, 57);
    } else if (num < 1e63) {
        return withSuffix(num / 1e60, 60);
    } else {
        return withSuffix(num / 1e63, 63);
    }
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
