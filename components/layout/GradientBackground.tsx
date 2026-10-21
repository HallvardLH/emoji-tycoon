import { View, StyleSheet } from "react-native";
import { palette } from "../misc/theme";

// The stage is a flat grape color, so the emojis are the only loud color on screen.
// The home screen adds its own spotlight behind the Big Emoji.
export default function GradientBackground() {
    return <View style={styles.container} />
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: palette.grape,
    }
})
