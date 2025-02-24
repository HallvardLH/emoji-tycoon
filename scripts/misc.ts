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
            return n.toLocaleString("en-US"); // Comma grouping
        } else if (form === "space") {
            return n.toLocaleString("en-US").replace(/,/g, " "); // Space grouping
        } else {
            return n.toString(); // Compact form, no separators
        }
    };

    const getSuffix = (power: number) => {
        if (shortForm) {
            switch (power) {
                case 6:
                    return " M";
                case 9:
                    return " B";
                case 12:
                    return " T";
                case 15:
                    return " Qa";
                case 18:
                    return " Qi";
                case 21:
                    return " Sx";
                case 24:
                    return " Sp";
                case 27:
                    return " Oc";
                case 30:
                    return " No";
                case 33:
                    return " Dc";
                case 36:
                    return " Ud";
                case 39:
                    return " Dd";
                case 42:
                    return " Td";
                case 45:
                    return " Qad";
                case 48:
                    return " Qid";
                case 51:
                    return " Sxd";
                case 54:
                    return " Spd";
                case 57:
                    return " Od";
                case 60:
                    return " Nd";
                case 63:
                    return " Vg";
                default:
                    return "";
            }
        } else {
            switch (power) {
                case 6:
                    return " million";
                case 9:
                    return " billion";
                case 12:
                    return " trillion";
                case 15:
                    return " quadrillion";
                case 18:
                    return " quintillion";
                case 21:
                    return " sextillion";
                case 24:
                    return " septillion";
                case 27:
                    return " octillion";
                case 30:
                    return " nonillion";
                case 33:
                    return " decillion";
                case 36:
                    return " undecillion";
                case 39:
                    return " duodecillion";
                case 42:
                    return " tredecillion";
                case 45:
                    return " quattuordecillion";
                case 48:
                    return " quindecillion";
                case 51:
                    return " sexdecillion";
                case 54:
                    return " septendecillion";
                case 57:
                    return " octodecillion";
                case 60:
                    return " novemdecillion";
                case 63:
                    return " vigintillion";
                default:
                    return "";
            }
        }
    };

    if (num < 1e3) {
        return formatWithSeparators(round(num));
    } else if (num < 1e6) {
        return formatWithSeparators(round(num));
    } else if (num < 1e9) {
        return formatWithSeparators(round(num / 1e6)) + getSuffix(6);
    } else if (num < 1e12) {
        return formatWithSeparators(round(num / 1e9)) + getSuffix(9);
    } else if (num < 1e15) {
        return formatWithSeparators(round(num / 1e12)) + getSuffix(12);
    } else if (num < 1e18) {
        return formatWithSeparators(round(num / 1e15)) + getSuffix(15);
    } else if (num < 1e21) {
        return formatWithSeparators(round(num / 1e18)) + getSuffix(18);
    } else if (num < 1e24) {
        return formatWithSeparators(round(num / 1e21)) + getSuffix(21);
    } else if (num < 1e27) {
        return formatWithSeparators(round(num / 1e24)) + getSuffix(24);
    } else if (num < 1e30) {
        return formatWithSeparators(round(num / 1e27)) + getSuffix(27);
    } else if (num < 1e33) {
        return formatWithSeparators(round(num / 1e30)) + getSuffix(30);
    } else if (num < 1e36) {
        return formatWithSeparators(round(num / 1e33)) + getSuffix(33);
    } else if (num < 1e39) {
        return formatWithSeparators(round(num / 1e36)) + getSuffix(36);
    } else if (num < 1e42) {
        return formatWithSeparators(round(num / 1e39)) + getSuffix(39);
    } else if (num < 1e45) {
        return formatWithSeparators(round(num / 1e42)) + getSuffix(42);
    } else if (num < 1e48) {
        return formatWithSeparators(round(num / 1e45)) + getSuffix(45);
    } else if (num < 1e51) {
        return formatWithSeparators(round(num / 1e48)) + getSuffix(48);
    } else if (num < 1e54) {
        return formatWithSeparators(round(num / 1e51)) + getSuffix(51);
    } else if (num < 1e57) {
        return formatWithSeparators(round(num / 1e54)) + getSuffix(54);
    } else if (num < 1e60) {
        return formatWithSeparators(round(num / 1e57)) + getSuffix(57);
    } else if (num < 1e63) {
        return formatWithSeparators(round(num / 1e60)) + getSuffix(60);
    } else {
        return formatWithSeparators(round(num / 1e63)) + getSuffix(63);
    }
}