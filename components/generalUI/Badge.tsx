import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Text from "./Text";
import { palette } from "../misc/theme";

interface BadgeProps {
    value: number | string;
    /** Color of the ring around the badge, to cut it out of what's behind it */
    ringColor?: string;
    style?: StyleProp<ViewStyle>;
}

/** Pink count badge. Pop pink is reserved for these. */
export default function Badge({ value, ringColor, style }: BadgeProps) {
    const label = typeof value === "number" && value > 99 ? "99+" : String(value);
    return (
        <View style={[styles.badge, ringColor ? { borderWidth: 2, borderColor: ringColor } : null, style]}>
            <Text font="black" size={12} color="#FFFFFF">{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        minWidth: 22,
        height: 22,
        paddingHorizontal: 6,
        borderRadius: 11,
        backgroundColor: palette.pop,
        alignItems: "center",
        justifyContent: "center",
    },
});
