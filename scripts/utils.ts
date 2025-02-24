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

    // Determine the magnitude of the number
    const magnitude = Math.floor(Math.log10(number));

    // Calculate the nearest lower and higher powers of 10
    const lowerPower = Math.pow(10, magnitude);
    const higherPower = Math.pow(10, magnitude + 1);

    // Find the midpoint between the two powers of 10
    const midpoint = lowerPower + (higherPower - lowerPower) / 2;

    // Round to the nearest power of 10
    if (number >= midpoint) {
        return higherPower;
    } else {
        return lowerPower;
    }
}