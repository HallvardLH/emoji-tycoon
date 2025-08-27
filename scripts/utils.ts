import * as Haptics from 'expo-haptics';

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


export const vibrateForDuration = async (duration: number, feedbackStyle: string = Haptics.ImpactFeedbackStyle.Medium) => {
    const interval = 100;
    const repetitions = duration / interval;

    for (let i = 0; i < repetitions; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await new Promise((resolve) => setTimeout(resolve, interval));
        // console.log(feedbackStyle)
    }
};

export const playHaptic = async (name: "boost") => {
    switch (name) {
        case "boost":
            const interval = 100;
            const haptic = Haptics.ImpactFeedbackStyle;
            type vibrationInstruction = {
                feedbackStyle: string,
                duration: number,
            }
            const vibrations: vibrationInstruction[] = [
                { feedbackStyle: haptic.Light, duration: 100 },
                { feedbackStyle: haptic.Soft, duration: 100 },
                { feedbackStyle: haptic.Rigid, duration: 100 },
                { feedbackStyle: haptic.Medium, duration: 100 },
                { feedbackStyle: haptic.Heavy, duration: 800 },
            ]
            vibrations.forEach(async vibration => {
                await vibrateForDuration(vibration.duration, vibration.feedbackStyle);
                await new Promise((resolve) => setTimeout(resolve, interval));
            })
    }
}
