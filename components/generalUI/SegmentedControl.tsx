import { View, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Text from "./Text";
import Badge from "./Badge";
import { palette, radii } from "../misc/theme";

interface Segment {
    label: string;
    badge?: number;
    onPress: () => void;
}

interface SegmentedControlProps {
    segments: Segment[];
    activeIndex: number;
    style?: StyleProp<ViewStyle>;
}

/** Dark track with a paper pill marking the active segment */
export default function SegmentedControl({ segments, activeIndex, style }: SegmentedControlProps) {
    return (
        <View style={[styles.track, style]} accessibilityRole="tablist">
            {segments.map((segment, index) => {
                const active = index === activeIndex;
                return (
                    <Pressable
                        key={segment.label}
                        onPress={segment.onPress}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        style={[styles.segment, active ? styles.segmentActive : null]}
                    >
                        <Text size={16} color={active ? palette.ink : palette.lilacLight}>{segment.label}</Text>
                        {!active && segment.badge ? <Badge value={segment.badge} /> : null}
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: "row",
        gap: 4,
        padding: 4,
        borderRadius: radii.md + 2,
        backgroundColor: palette.shade,
    },
    segment: {
        flex: 1,
        height: 40,
        borderRadius: radii.md - 2,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentActive: {
        backgroundColor: palette.paper,
    },
});
