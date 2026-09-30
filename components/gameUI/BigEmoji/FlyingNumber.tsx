import { StyleSheet, Animated } from "react-native";
import React, { useMemo } from "react";
import { fonts } from "../../misc/theme";

interface FlyingNumberProps {
    number: string;
    /** 0 → 1 over the flight, eased out */
    progress: Animated.Value;
    x: number;
    y: number;
    /** Degrees it tilts by the end */
    tilt: number;
    color?: string;
    size?: number;
}

export const FlyingNumber = React.memo(({ number, progress, x, y, tilt, color = "#FFFFFF", size = 26 }: FlyingNumberProps) => {
    const style = useMemo(() => ({
        color,
        fontSize: size,
        opacity: progress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [1, 1, 0] }),
        transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
            { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${tilt}deg`] }) },
            // Punches in oversized, settles, then shrinks a little as it fades
            { scale: progress.interpolate({ inputRange: [0, 0.1, 0.25, 1], outputRange: [0.3, 1.35, 1, 0.85] }) },
        ],
    }), [progress, x, y, tilt, color, size]);

    return (
        <Animated.Text pointerEvents="none" style={[styles.number, style]}>
            {number}
        </Animated.Text>
    );
});

const styles = StyleSheet.create({
    number: {
        fontFamily: fonts.display,
        position: 'absolute',
        textShadowColor: "rgba(0, 0, 0, 0.35)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    },
});
