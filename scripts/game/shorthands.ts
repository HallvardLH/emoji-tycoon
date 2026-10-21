import store from "../redux/reduxStore"

// Returns whether the fun value is within a certain range, or if it is a certain number
export function howFun(start: number, end?: number) {
    const funValue = store.getState().values.funValue;
    // if only start is provided, or start is higher than end
    if (!end || start > end) {
        return start === funValue
    }

    return funValue >= start && funValue <= end;
}

/**
 * Hidden production bonus from the fun value
 * - 42 (the answer): +4.2%
 * - 50 (perfectly balanced): ×1.5, paid for with half tapping power
 */
export function funProductionMultiplier() {
    return (howFun(42) ? 1.042 : 1) * (howFun(50) ? 1.5 : 1);
}

/** Hidden tapping modifier from the fun value: 50 (perfectly balanced) halves it */
export function funTapMultiplier() {
    return howFun(50) ? 0.5 : 1;
}

export const getEmojisPerSecond = () => {
    return store.getState().values.emojisPerSecond;
}

export const getEmojisPerTap = () => {
    return store.getState().bigEmoji.emojisPerTap;
}

export const getEmojisInBank = () => {
    return store.getState().values.emojis;
}
