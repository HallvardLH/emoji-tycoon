import { useEffect, useState } from "react";
import store, { RootState } from "../../scripts/redux/reduxStore";

/**
 * The current bank and production, sampled every `interval` ms.
 *
 * The bank changes every game tick (100ms); lists that only need to know
 * what's affordable use this instead of re-rendering on every tick.
 */
export function useBank(interval = 500) {
    const read = () => {
        const { emojis, emojisPerSecond } = store.getState().values;
        return { emojis, emojisPerSecond };
    };
    const [bank, setBank] = useState(read);

    useEffect(() => {
        const id = setInterval(() => setBank(read()), interval);
        return () => clearInterval(id);
    }, [interval]);

    return bank;
}

/**
 * Like useSelector, but reads the store at most every `interval` ms instead of on every
 * change. For displays of things that change on every tap or tick (the collection, stats),
 * where re-rendering that often costs more than it shows. Only re-renders when the
 * selected value changed.
 */
export function useSampledSelector<T>(selector: (state: RootState) => T, interval = 500) {
    const [value, setValue] = useState(() => selector(store.getState()));

    useEffect(() => {
        const id = setInterval(() => {
            const next = selector(store.getState());
            setValue(current => current === next ? current : next);
        }, interval);
        return () => clearInterval(id);
    }, [interval]);

    return value;
}

/**
 * How long until the bank reaches `price` at the current production, as a short label ("IN 3 MIN").
 */
export function timeToAfford(price: number, emojis: number, emojisPerSecond: number) {
    if (emojisPerSecond <= 0) return "NEED MORE";
    const seconds = (price - emojis) / emojisPerSecond;
    if (seconds < 60) return `IN ${Math.max(1, Math.ceil(seconds))} SEC`;
    if (seconds < 3600) return `IN ${Math.ceil(seconds / 60)} MIN`;
    if (seconds < 86400) return `IN ${Math.ceil(seconds / 3600)} HRS`;
    const days = Math.ceil(seconds / 86400);
    return days > 999 ? "A LONG TIME" : `IN ${days} DAYS`;
}
