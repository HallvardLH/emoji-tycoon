import { Pressable, StyleSheet } from "react-native";
import { SCREENSHOT_MODE, requestOpenCheats } from "../../scripts/screenshotMode";

/** In screenshot mode, an invisible strip on the right edge that opens the cheats */
export default function ScreenshotCheatsTrigger() {
    if (!SCREENSHOT_MODE) return null;
    return <Pressable onPress={requestOpenCheats} style={styles.strip} accessibilityLabel="Cheats" />;
}

const styles = StyleSheet.create({
    strip: {
        position: "absolute",
        // Clear of the system back gesture along the edge
        right: 16,
        top: "50%",
        width: 40,
        height: 96,
    },
});
