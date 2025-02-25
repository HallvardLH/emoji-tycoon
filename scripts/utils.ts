// Calculates percentage of a number
export function percentageOf(percentage: number, number: number) {
    return percentage / 100 * number
}

// Calculates what percentage a number is of another number
export function getPercentage(number1: number, number2: number) {
    if (number2 === 0) {
        throw new Error("number2 cannot be zero, as it would result in a division by zero.");
    }
    return (number1 / number2) * 100;
}

export function roundToPrettyNumber(number: number) {
    if (number === 0) return 0;

    const prettyRound = Math.pow(10, (Math.ceil(Math.log(Math.ceil(number)) / Math.LN10))) / 100;
    return Math.round(number / prettyRound) * prettyRound
}

export function getRandomBetween(min: number, max: number) {
    return Math.random() * (max - min + Number.EPSILON) + min;
}