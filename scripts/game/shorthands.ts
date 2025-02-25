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

export const getEmojisPerSecond = () => {
    return store.getState().values.emojisPerSecond;
}

export const getEmojisPerTap = () => {
    return store.getState().bigEmoji.emojisPerTap;
}

export const getEmojisInBank = () => {
    return store.getState().values.emojis;
}
