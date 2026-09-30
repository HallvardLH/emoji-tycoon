import { View, Pressable, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import Badge from "../generalUI/Badge";
import { palette } from "../misc/theme";

interface TabButtonProps {
    label: string;
    onPress?: () => void;
    icon: string;
    notifications?: number;
    active?: boolean;
}

export default function TabButton({ label, onPress, icon, notifications, active }: TabButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={notifications ? `${label}, ${notifications} new` : label}
            style={styles.container}
        >
            {active ? (
                // The active tab rises out of the bar on a sun disc
                <View style={styles.raised}>
                    <View style={styles.raisedLedge} />
                    <View style={styles.raisedFace}>
                        <Text size={30} style={styles.emoji}>{icon}</Text>
                    </View>
                </View>
            ) : (
                <Text size={28} style={styles.emoji}>{icon}</Text>
            )}
            <Text font="black" size={12} color={active ? "#FFFFFF" : palette.lilac} style={styles.label}>{label.toUpperCase()}</Text>
            {!active && notifications ? (
                <Badge value={notifications} ringColor={palette.night} style={styles.badge} />
            ) : null}
        </Pressable>
    )
}

const RAISED = 58;

const styles = StyleSheet.create({
    container: {
        width: 84,
        minHeight: 56,
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 4,
    },
    emoji: {
        lineHeight: 34,
    },
    label: {
        letterSpacing: 0.7,
    },
    raised: {
        width: RAISED,
        height: RAISED + 5,
        marginTop: -30,
    },
    raisedLedge: {
        position: "absolute",
        top: 5,
        width: RAISED,
        height: RAISED,
        borderRadius: RAISED / 2,
        backgroundColor: palette.sunLedge,
    },
    raisedFace: {
        width: RAISED,
        height: RAISED,
        borderRadius: RAISED / 2,
        backgroundColor: palette.sun,
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        top: -6,
        right: 12,
    },
})
