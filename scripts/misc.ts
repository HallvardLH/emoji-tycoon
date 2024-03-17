export function formatNumber(num: number) {
    const round = (num: number) => Math.round(num * 1000) / 1000;

    if (num < 1e3) {
        return round(num).toString();
    } else if (num < 1e6) {
        return round(num).toString();
    } else if (num < 1e9) {
        return round(num / 1e6) + " million";
    } else if (num < 1e12) {
        return round(num / 1e9) + " billion";
    } else if (num < 1e15) {
        return round(num / 1e12) + " trillion";
    } else if (num < 1e18) {
        return round(num / 1e15) + " quadrillion";
    } else if (num < 1e21) {
        return round(num / 1e18) + " quintillion";
    } else if (num < 1e24) {
        return round(num / 1e21) + " sextillion";
    } else if (num < 1e27) {
        return round(num / 1e24) + " septillion";
    } else if (num < 1e30) {
        return round(num / 1e27) + " octillion";
    } else if (num < 1e33) {
        return round(num / 1e30) + " nonillion";
    } else if (num < 1e36) {
        return round(num / 1e33) + " decillion";
    } else if (num < 1e39) {
        return round(num / 1e36) + " undecillion";
    } else if (num < 1e42) {
        return round(num / 1e39) + " duodecillion";
    } else if (num < 1e45) {
        return round(num / 1e42) + " tredecillion";
    } else if (num < 1e48) {
        return round(num / 1e45) + " quattuordecillion";
    } else if (num < 1e51) {
        return round(num / 1e48) + " quindecillion";
    } else if (num < 1e54) {
        return round(num / 1e51) + " sexdecillion";
    } else if (num < 1e57) {
        return round(num / 1e54) + " septendecillion";
    } else if (num < 1e60) {
        return round(num / 1e57) + " octodecillion";
    } else if (num < 1e63) {
        return round(num / 1e60) + " novemdecillion";
    } else {
        return round(num / 1e63) + " vigintillion";
    }
}
