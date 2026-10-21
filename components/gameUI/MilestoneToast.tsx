import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Text from "../generalUI/Text";
import { Milestone, onMilestone } from "../../scripts/game/milestones";
import { palette, radii } from "../misc/theme";

// How long each banner stays up
const SHOW_FOR = 3200;
const SPARKS = ["✨", "🎉", "⭐", "✨", "🎊", "⭐"];

/**
 * Milestone banners that drop in from the top over any screen.
 * Milestones that happen together are shown one after another.
 */
export default function MilestoneToast() {
    const [queue, setQueue] = useState<(Milestone & { id: number })[]>([]);

    useEffect(() => onMilestone(milestone => {
        setQueue(current => [...current, { ...milestone, id: Date.now() + Math.random() }]);
    }), []);

    const current = queue[0];
    if (!current) return null;

    return (
        <Banner
            key={current.id}
            milestone={current}
            onDone={() => setQueue(q => q.slice(1))}
        />
    );
}

function Banner({ milestone, onDone }: { milestone: Milestone, onDone: () => void }) {
    const insets = useSafeAreaInsets();
    const slide = useRef(new Animated.Value(0)).current;
    const burst = useRef(new Animated.Value(0)).current;

    const sparks = useMemo(() => SPARKS.map((emoji, i) => {
        const angle = (i / SPARKS.length) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 44 + Math.random() * 24;
        return { emoji, dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance };
    }), []);

    useEffect(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Animated.sequence([
            Animated.spring(slide, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
            Animated.delay(SHOW_FOR),
            Animated.timing(slide, { toValue: 0, duration: 300, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start(onDone);
        Animated.sequence([
            Animated.delay(150),
            Animated.timing(burst, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={[styles.wrapper, { top: insets.top + 10 }]} pointerEvents="none">
            <Animated.View
                accessibilityLiveRegion="polite"
                accessibilityLabel={`${milestone.caption}: ${milestone.title}`}
                style={[styles.card, {
                    opacity: slide,
                    transform: [
                        { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) },
                        { scale: slide.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                    ],
                }]}
            >
                <View style={styles.iconTile}>
                    {sparks.map((spark, i) => (
                        <Animated.Text
                            key={i}
                            style={[styles.spark, {
                                opacity: burst.interpolate({ inputRange: [0, 0.2, 0.7, 1], outputRange: [0, 1, 1, 0] }),
                                transform: [
                                    { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dx] }) },
                                    { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dy] }) },
                                    { scale: burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1.1, 0.7] }) },
                                ],
                            }]}
                        >
                            {spark.emoji}
                        </Animated.Text>
                    ))}
                    <Text size={32} style={{ lineHeight: 40 }}>{milestone.icon}</Text>
                </View>
                <View style={styles.text}>
                    <Text font="black" size={11} color={palette.violetDeep} style={styles.caption}>{milestone.caption}</Text>
                    <Text size={19} color={palette.ink} numberOfLines={2} style={{ lineHeight: 22 }}>{milestone.title}</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 16,
        right: 16,
        alignItems: "center",
        zIndex: 100,
        elevation: 100,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 12,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
        borderWidth: 3,
        borderColor: palette.sun,
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    iconTile: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    spark: {
        position: "absolute",
        fontSize: 18,
    },
    text: {
        flex: 1,
        gap: 2,
    },
    caption: {
        letterSpacing: 1.2,
    },
});
