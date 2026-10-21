import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Text from "../generalUI/Text";
import { palette } from "../misc/theme";

// How long the whole celebration lasts; the text holds for most of it
const DURATION = 3400;
// How long the sparks take to fly out and fade
const SPARK_DURATION = 1100;
// The text's box, centred on the effect
export const EFFECT_BURST_WIDTH = 260;

export interface Celebration {
    /** Small line above, e.g. "🎁 GIFT!" */
    headline: string;
    /** The big number, e.g. "+352,690" or "×2" */
    value: string;
    /** Small line below, e.g. "EMOJIS" or "TAPPING · 20 SEC" */
    caption: string;
    /** Emojis that burst outwards */
    sparks: string[];
    /** Color of the big number */
    color: string;
}

interface EffectBurstProps extends Celebration {
    /** Where the effect was, relative to the play area */
    x: number;
    y: number;
    onDone: () => void;
}

/**
 * Celebrates tapping an effect emoji: a ring of emojis bursts out of it,
 * and what you got pops in with an overshoot, floats up, holds, then fades away.
 */
export default function EffectBurst({ headline, value, caption, sparks, color, x, y, onDone }: EffectBurstProps) {
    const pop = useRef(new Animated.Value(0)).current;
    const rise = useRef(new Animated.Value(0)).current;
    const burst = useRef(new Animated.Value(0)).current;

    // Each spark gets its own direction, distance and spin, fixed for this burst
    const flying = useMemo(() => sparks.map((emoji, i) => {
        const angle = (i / sparks.length) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 70 + Math.random() * 55;
        return { emoji, dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance, spin: `${Math.round(Math.random() * 120 - 60)}deg` };
    }), []);

    useEffect(() => {
        Animated.parallel([
            // Text: overshoot in, then settle
            Animated.spring(pop, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
            // Text: drift upwards the whole time, slowing down
            Animated.timing(rise, { toValue: 1, duration: DURATION, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            // Sparks fly out fast and slow down
            Animated.timing(burst, { toValue: 1, duration: SPARK_DURATION, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        const timeout = setTimeout(onDone, DURATION);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={[styles.origin, { left: x, top: y }]} pointerEvents="none">
            {flying.map((spark, i) => (
                <Animated.Text
                    key={i}
                    style={[styles.spark, {
                        opacity: burst.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 1, 0] }),
                        transform: [
                            { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dx] }) },
                            { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dy] }) },
                            { scale: burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1.2, 0.8] }) },
                            { rotate: burst.interpolate({ inputRange: [0, 1], outputRange: ["0deg", spark.spin] }) },
                        ],
                    }]}
                >
                    {spark.emoji}
                </Animated.Text>
            ))}

            <Animated.View style={[styles.textBox, {
                // Holds fully visible for most of the time, then fades
                opacity: rise.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
                transform: [
                    { translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) },
                    { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                ],
            }]}>
                <Text font="black" size={13} color={palette.lilacLight} style={styles.caption} shadow>{headline}</Text>
                <Text size={36} color={color} shadow style={styles.value} numberOfLines={1}>{value}</Text>
                <Text font="black" size={12} color="#FFFFFF" style={styles.caption} shadow>{caption}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    // A zero-size point at the effect's centre that everything radiates from
    origin: {
        position: "absolute",
        width: 0,
        height: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    spark: {
        position: "absolute",
        fontSize: 26,
    },
    textBox: {
        position: "absolute",
        width: EFFECT_BURST_WIDTH,
        alignItems: "center",
    },
    value: {
        lineHeight: 40,
        textShadowColor: "rgba(0, 0, 0, 0.45)",
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },
    caption: {
        letterSpacing: 1.2,
    },
});
