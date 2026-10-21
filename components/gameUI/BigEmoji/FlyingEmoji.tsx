import { StyleSheet, Animated, Platform } from 'react-native';
import React, { useMemo } from "react";

/** Where a tapped emoji goes, sampled so one 0→1 progress value can drive it */
export interface FlightPath {
    /** Progress points the samples are taken at */
    inputRange: number[];
    /** Vertical offset at each progress point */
    y: number[];
    /** Horizontal offset at the end (travels at a constant speed) */
    x: number;
    /** Degrees it has spun by the end */
    spin: number;
    /** Low gravity: rises and fades instead of falling */
    floatUp: boolean;
}

const SAMPLES = 10;

/**
 * A hop up, then a fall under gravity: y(t) = -a·t + b·t², peaking `hop` px above
 * the start and ending `fall` px below it
 */
export function makeFlightPath(hop: number, fall: number, x: number, spin: number): FlightPath {
    const a = 2 * hop + 2 * Math.sqrt(hop * hop + hop * fall);
    const b = a + fall;
    const inputRange = Array.from({ length: SAMPLES + 1 }, (_, i) => i / SAMPLES);
    return { inputRange, y: inputRange.map(t => -a * t + b * t * t), x, spin, floatUp: false };
}

/** Low gravity: drifts up and slows down, like a balloon let go */
export function makeFloatPath(rise: number, x: number, spin: number): FlightPath {
    const inputRange = Array.from({ length: SAMPLES + 1 }, (_, i) => i / SAMPLES);
    return { inputRange, y: inputRange.map(t => -rise * (1 - (1 - t) * (1 - t))), x, spin, floatUp: true };
}

interface FlyingEmojiProps {
    emoji: string;
    /** 0 → 1 over the flight */
    progress: Animated.Value;
    path: FlightPath;
}

export const FlyingEmoji = React.memo(({ emoji, progress, path }: FlyingEmojiProps) => {
    // Built once per flight; the emoji never re-renders while it flies
    const style = useMemo(() => ({
        opacity: progress.interpolate(path.floatUp
            ? { inputRange: [0, 0.4, 1], outputRange: [1, 0.8, 0] }
            : { inputRange: [0, 0.55, 1], outputRange: [1, 0.9, 0] }),
        transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, path.x] }) },
            { translateY: progress.interpolate({ inputRange: path.inputRange, outputRange: path.y }) },
            { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${path.spin}deg`] }) },
            // Shrinks a little as it falls away
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }) },
        ],
    }), [progress, path]);

    return (
        <Animated.Text pointerEvents="none" style={[styles.bigEmoji, style]}>
            {emoji}
        </Animated.Text>
    );
});

const styles = StyleSheet.create({
    bigEmoji: {
        // Matches the Big Emoji so it looks like the same emoji flying off
        fontSize: Platform.OS == "android" ? 130 : 150,
        lineHeight: Platform.OS == "android" ? 150 : 175,
        position: 'absolute',
    },
});
