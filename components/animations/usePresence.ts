import { useCallback, useRef, useState } from "react";

type Key = string | number;

export interface Presence<T> {
    key: Key;
    item: T;
    /** Gone from the list; animate out, then call `remove(key)` */
    leaving: boolean;
}

/**
 * Keeps items on screen after they leave a list, so they can animate out instead of
 * popping out of existence. Leaving items keep their place and their last value.
 */
export function usePresence<T>(items: T[], keyOf: (item: T) => Key): [Presence<T>[], (key: Key) => void] {
    const shown = useRef<Presence<T>[]>([]);
    const [, rerender] = useState(0);

    const current = new Map(items.map(item => [keyOf(item), item]));
    const next: Presence<T>[] = shown.current.map(entry => current.has(entry.key)
        ? { key: entry.key, item: current.get(entry.key)!, leaving: false }
        : { ...entry, leaving: true });
    const known = new Set(next.map(entry => entry.key));
    items.forEach(item => {
        const key = keyOf(item);
        if (!known.has(key)) next.push({ key, item, leaving: false });
    });
    shown.current = next;

    const remove = useCallback((key: Key) => {
        shown.current = shown.current.filter(entry => !(entry.key === key && entry.leaving));
        rerender(x => x + 1);
    }, []);

    return [next, remove];
}
