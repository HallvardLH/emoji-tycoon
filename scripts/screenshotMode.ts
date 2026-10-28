import { DeviceEventEmitter, LogBox } from "react-native";

/**
 * Screenshot mode, for the store images: start Metro with EXPO_PUBLIC_SCREENSHOT_MODE=1.
 * Development builds only. Dev warnings are off and the cheats button is hidden; an invisible
 * strip on the right edge, halfway down the screen, opens the cheats instead, so moments can
 * still be staged.
 */
export const SCREENSHOT_MODE = __DEV__ && process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1";

if (SCREENSHOT_MODE) LogBox.ignoreAllLogs();

const OPEN_CHEATS = "screenshotMode.openCheats";

export function requestOpenCheats() {
    DeviceEventEmitter.emit(OPEN_CHEATS);
}

export function onOpenCheatsRequest(listener: () => void) {
    const subscription = DeviceEventEmitter.addListener(OPEN_CHEATS, listener);
    return () => subscription.remove();
}
