import { useSyncExternalStore } from "react";
import { Platform, useWindowDimensions } from "react-native";

/**
 * Desktop: the web build in a wide window shows the Shop, the Big Emoji and the
 * Emojidex side by side instead of tabs. The app on phones and tablets never does,
 * and neither does the web build in a narrow window.
 */
export const DESKTOP_MIN_WIDTH = 1000;

export function useIsDesktop() {
    const { width } = useWindowDimensions();
    return Platform.OS === "web" && width >= DESKTOP_MIN_WIDTH;
}

// ---- What the right-hand column shows on desktop, picked in its navbar ----

export type DesktopPanel = "buildings" | "emojidex" | "settings";

let panel: DesktopPanel = "buildings";
// Where the menu button goes back to when it closes the settings
let beforeSettings: DesktopPanel = "buildings";
const listeners = new Set<() => void>();

export function setDesktopPanel(next: DesktopPanel) {
    if (next === "settings" && panel !== "settings") beforeSettings = panel;
    panel = next;
    listeners.forEach(listener => listener());
}

/** The menu button: opens the settings, or goes back to what was showing before */
export function toggleDesktopSettings() {
    setDesktopPanel(panel === "settings" ? beforeSettings : "settings");
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function useDesktopPanel() {
    return useSyncExternalStore(subscribe, () => panel);
}
