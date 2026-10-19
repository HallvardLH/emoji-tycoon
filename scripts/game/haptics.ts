import * as ExpoHaptics from "expo-haptics";
import store from "../redux/reduxStore";

/**
 * Vibration, the same calls as expo-haptics, silent when it's switched off in Settings.
 * Import this instead of expo-haptics.
 */

export { ImpactFeedbackStyle, NotificationFeedbackType } from "expo-haptics";

// Missing from saves made before the setting existed: on
const enabled = () => store.getState().preferences.vibration ?? true;

export function impactAsync(style?: ExpoHaptics.ImpactFeedbackStyle) {
    return enabled() ? ExpoHaptics.impactAsync(style).catch(() => {}) : Promise.resolve();
}

export function notificationAsync(type?: ExpoHaptics.NotificationFeedbackType) {
    return enabled() ? ExpoHaptics.notificationAsync(type).catch(() => {}) : Promise.resolve();
}
