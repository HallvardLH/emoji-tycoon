import { StyleSheet, Animated, View } from "react-native";
import React, { useMemo } from "react";

export interface Spark {
    /** Direction it flies, in radians */
    angle: number;
    /** How far from the centre it ends up */
    distance: number;
    size: number;
}

/** Evenly spread, slightly jittered sparks; more of them at higher combos */
export function makeSparks(count: number): Spark[] {
    const offset = Math.random() * Math.PI * 2;
    return Array.from({ length: count }, (_, i) => ({
        angle: offset + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
        distance: 120 + Math.random() * 40,
        size: 14 + Math.random() * 8,
    }));
}

interface TapSparksProps {
    /** 0 → 1 over the burst, eased out */
    progress: Animated.Value;
    sparks: Spark[];
    color: string;
}

/** Little stars shooting out from under the Big Emoji on a tap */
export const TapSparks = React.memo(({ progress, sparks, color }: TapSparksProps) => {
    const styles = useMemo(() => sparks.map(spark => {
        // Start just inside the emoji, so they seem to burst out from behind it
        const startX = Math.cos(spark.angle) * 55;
        const startY = Math.sin(spark.angle) * 55;
        const endX = Math.cos(spark.angle) * spark.distance;
        const endY = Math.sin(spark.angle) * spark.distance;
        return {
            color,
            fontSize: spark.size,
            opacity: progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
            transform: [
                { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [startX, endX] }) },
                { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [startY, endY] }) },
                { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) },
                { scale: progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.4, 1.2, 0.3] }) },
            ],
        };
    }), [progress, sparks, color]);

    return (
        <View style={base.layer} pointerEvents="none">
            {styles.map((style, i) => (
                <Animated.Text key={i} style={[base.spark, style]}>✦</Animated.Text>
            ))}
        </View>
    );
});

const base = StyleSheet.create({
    layer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    spark: {
        position: "absolute",
        fontWeight: "900",
        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
