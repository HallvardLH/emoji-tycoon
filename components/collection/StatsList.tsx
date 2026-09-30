import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";
import { palette, radii } from "../misc/theme";

export default function StatsList() {
    const { bigEmojiTaps, emojisEarnedFromTap, effectEmojisCollected, emojisGained, shinyEmojisTapped } = useSelector((state: RootState) => state.stats);
    const { funValue } = useSelector((state: RootState) => state.values);

    const rows: [string, string, string][] = [
        ["✍️", "Total emojis drawn", formatNumber(emojisGained, 0)],
        ["👆", "Emoji taps", formatNumber(bigEmojiTaps)],
        ["💥", "Emojis earned from tapping", formatNumber(emojisEarnedFromTap)],
        ["🪄", "Magical emojis tapped", formatNumber(effectEmojisCollected)],
        ["✨", "Shiny emojis tapped", formatNumber(shinyEmojisTapped ?? 0)],
    ];
    if (funValue == 100) rows.push(["😭", "Fun value", formatNumber(funValue)]);

    return (
        <View style={styles.card}>
            {rows.map(([icon, label, value], index) => (
                <View key={label} style={[styles.row, index > 0 ? styles.divider : null]}>
                    <View style={styles.icon}><Text size={18} style={{ lineHeight: 24 }}>{icon}</Text></View>
                    <Text font="bold" size={14} color={palette.muted} style={styles.label}>{label}</Text>
                    <Text size={18} color={palette.ink}>{value}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: palette.track,
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        flex: 1,
    },
})
