export function formatNumber(num: number, decimals: number = 2) {
    const round = (num: number) => Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);

    const form: "compact" | "grouped" | "space" = "grouped"; // Set the form here

    const formatWithSeparators = (n: number) => {
        if (form === "grouped") {
            return n.toLocaleString("en-US"); // Comma grouping
        } else if (form === "space") {
            return n.toLocaleString("en-US").replace(/,/g, " "); // Space grouping
        } else {
            return n.toString(); // Compact form, no separators
        }
    };

    if (num < 1e3) {
        return formatWithSeparators(round(num));
    } else if (num < 1e6) {
        return formatWithSeparators(round(num));
    } else if (num < 1e9) {
        return formatWithSeparators(round(num / 1e6)) + " million";
    } else if (num < 1e12) {
        return formatWithSeparators(round(num / 1e9)) + " billion";
    } else if (num < 1e15) {
        return formatWithSeparators(round(num / 1e12)) + " trillion";
    } else if (num < 1e18) {
        return formatWithSeparators(round(num / 1e15)) + " quadrillion";
    } else if (num < 1e21) {
        return formatWithSeparators(round(num / 1e18)) + " quintillion";
    } else if (num < 1e24) {
        return formatWithSeparators(round(num / 1e21)) + " sextillion";
    } else if (num < 1e27) {
        return formatWithSeparators(round(num / 1e24)) + " septillion";
    } else if (num < 1e30) {
        return formatWithSeparators(round(num / 1e27)) + " octillion";
    } else if (num < 1e33) {
        return formatWithSeparators(round(num / 1e30)) + " nonillion";
    } else if (num < 1e36) {
        return formatWithSeparators(round(num / 1e33)) + " decillion";
    } else if (num < 1e39) {
        return formatWithSeparators(round(num / 1e36)) + " undecillion";
    } else if (num < 1e42) {
        return formatWithSeparators(round(num / 1e39)) + " duodecillion";
    } else if (num < 1e45) {
        return formatWithSeparators(round(num / 1e42)) + " tredecillion";
    } else if (num < 1e48) {
        return formatWithSeparators(round(num / 1e45)) + " quattuordecillion";
    } else if (num < 1e51) {
        return formatWithSeparators(round(num / 1e48)) + " quindecillion";
    } else if (num < 1e54) {
        return formatWithSeparators(round(num / 1e51)) + " sexdecillion";
    } else if (num < 1e57) {
        return formatWithSeparators(round(num / 1e54)) + " septendecillion";
    } else if (num < 1e60) {
        return formatWithSeparators(round(num / 1e57)) + " octodecillion";
    } else if (num < 1e63) {
        return formatWithSeparators(round(num / 1e60)) + " novemdecillion";
    } else {
        return formatWithSeparators(round(num / 1e63)) + " vigintillion";
    }
}

