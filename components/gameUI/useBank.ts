import { useEffect, useState } from "react";
import store, { RootState } from "../../scripts/redux/reduxStore";
import i18n from "../../i18n";
import { toCaps } from "../../scripts/utils";

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
 * `inline` gives the form for the middle of a sentence ("in 3 min"), which languages write differently
 * than just lowercasing the label would (German nouns keep their capitals, for one).
 */
export function timeToAfford(price: number, emojis: number, emojisPerSecond: number, inline = false) {
    const label = (key: string, count?: number) => inline
        ? i18n.t(`bank.timeToAffordInline.${key}`, { count })
        : toCaps(i18n.t(`bank.timeToAfford.${key}`, { count }));
    if (emojisPerSecond <= 0) return label("needMore");
    const seconds = (price - emojis) / emojisPerSecond;
    if (seconds < 60) return label("seconds", Math.max(1, Math.ceil(seconds)));
    if (seconds < 3600) return label("minutes", Math.ceil(seconds / 60));
    if (seconds < 86400) return label("hours", Math.ceil(seconds / 3600));
    const days = Math.ceil(seconds / 86400);
    return days > 999 ? label("aLongTime") : label("days", days);
}
