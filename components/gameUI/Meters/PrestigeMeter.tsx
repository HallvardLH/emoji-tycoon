import { Pressable, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "../../../scripts/redux/reduxStore";
import { essenceForEmojis, emojisForEssence } from "../../../scripts/game/prestige/prestige";
import Text from "../../generalUI/Text";
import { palette, radii } from "../../misc/theme";

// Shows up once the first essence is a tenth of the way there
const SHOW_FROM = emojisForEssence(1) / 10;

/**
 * Emoji essence on the home screen: how much a prestige would give, and how close the next one is.
 * Opens the prestige screen.
 */
export default function PrestigeMeter() {
    const router = useRouter();
    // Derived values only: the emojis drawn change every tick, these rarely do
    const visible = useSelector((state: RootState) => (state.prestige.prestiges ?? 0) > 0 || state.stats.emojisGained >= SHOW_FROM);
    const pending = useSelector((state: RootState) =>
        Math.max(0, essenceForEmojis(state.stats.emojisGained) - (state.prestige.totalEssenceEarned ?? 0)));
    // Updated once a second by the game loop
    const progress = useSelector((state: RootState) => state.prestige.remainingEmojisPrestigePerc);

    if (!visible) return null;
    const ready = pending >= 1;

    return (
        <Pressable
            onPress={() => router.push("/prestige")}
            accessibilityRole="button"
            accessibilityLabel={ready ? `Prestige for ${pending} emoji essence` : "Emoji essence"}
            style={({ pressed }) => [styles.chip, ready ? styles.chipReady : null, pressed ? { opacity: 0.8 } : null]}
        >
            <Text size={18} style={{ lineHeight: 22 }}>✨</Text>
            <View style={styles.body}>
                <Text font="black" size={12} color={ready ? palette.ink : "#FFFFFF"}>
                    {ready ? `+${pending} essence` : "Essence"}
                </Text>
                <View style={[styles.track, ready ? styles.trackReady : null]}>
                    <View style={[styles.fill, ready ? styles.fillReady : null, { width: `${Math.max(2, progress)}%` }]} />
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6,
        paddingLeft: 10,
        paddingRight: 12,
        borderRadius: radii.pill,
        backgroundColor: palette.glass,
    },
    chipReady: {
        backgroundColor: palette.sun,
    },
    body: {
        gap: 3,
    },
    track: {
        width: 70,
        height: 4,
        borderRadius: 2,
        backgroundColor: palette.glassLine,
        overflow: "hidden",
    },
    trackReady: {
        backgroundColor: "rgba(0,0,0,0.15)",
    },
    fill: {
        height: 4,
        borderRadius: 2,
        backgroundColor: palette.sun,
    },
    fillReady: {
        backgroundColor: palette.ink,
    },
});
