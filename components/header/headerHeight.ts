import { useSyncExternalStore } from "react";

/**
 * How tall the Header is, status bar included (0 on desktop, which has none)
 *
 * The Header is transparent and the screens run up under it, so the emoji rain
 * can fall behind it. Screens use this to start their content below it.
 */
let height = 0;
const listeners = new Set<() => void>();

export function getHeaderHeight() {
    return height;
}

export function setHeaderHeight(next: number) {
    if (next === height) return;
    height = next;
    listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

/** The Header's height, re-rendering when it changes */
export function useHeaderHeight() {
    return useSyncExternalStore(subscribe, getHeaderHeight);
}
