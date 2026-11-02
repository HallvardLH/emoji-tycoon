import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { STARS, onBigEmojiTap } from "../../scripts/game/prestige/story";
import { palette } from "../misc/theme";

interface SkyProps {
    size: number;
    /** How many stars are lit */
    stars: number;
    /** Whether the faint face shows through */
    face: boolean;
    /** How visible the face is (it's meant to be barely there on the home screen) */
    faceOpacity?: number;
    /** The face looks at the Big Emoji when it's tapped */
    followTaps?: boolean;
    /** The newest star fades in, for the ascension */
    revealNewest?: boolean;
}

// Fixed wobble, so the face is drawn the same shaky way every time
const wobble = (i: number) => Math.sin(i * 12.9898) * 1.6 + Math.sin(i * 4.1414) * 0.9;

/** A line drawn by a beginner: the points, each nudged a little off */
function shakyPath(points: [number, number][], closed = false) {
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${(x + wobble(i) * 0.6).toFixed(2)} ${(y + wobble(i + 7) * 0.6).toFixed(2)}`).join(" ") + (closed ? " Z" : "");
}

const HEAD = shakyPath(Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2;
    const r = 44 + wobble(i);
    return [50 + Math.cos(angle) * r, 48 + Math.sin(angle) * r] as [number, number];
}), true);

const SMILE = shakyPath(Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return [32 + t * 36, 72 + Math.sin(t * Math.PI) * 9] as [number, number];
}));

// High on the face, so they peek over the Big Emoji in the middle and look down at it
const EYES = [{ x: 36, y: 24 }, { x: 64, y: 24 }];

/**
 * The sky behind the Big Emoji: a star per prestige, and the First Emoji's faint face
 * that the stars turn out to be part of (see story.ts)
 */
export default function Sky({ size, stars, face, faceOpacity = 0.08, followTaps = false, revealNewest = false }: SkyProps) {
    const twinkle = useRef(new Animated.Value(0)).current;
    const newest = useRef(new Animated.Value(revealNewest ? 0 : 1)).current;
    const gaze = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    useEffect(() => {
        const loop = Animated.loop(Animated.timing(twinkle, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true }));
        loop.start();
        return () => loop.stop();
    }, []);

    useEffect(() => {
        if (!revealNewest) return;
        Animated.sequence([
            Animated.delay(900),
            Animated.timing(newest, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, [revealNewest]);

    // The eyes wander, and look at the Big Emoji (the middle) when it's tapped
    useEffect(() => {
        if (!face) return;
        let timeout: ReturnType<typeof setTimeout>;
        const wander = () => {
            Animated.timing(gaze, { toValue: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 1.4 }, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();
            timeout = setTimeout(wander, 4000 + Math.random() * 5000);
        };
        wander();
        const unsubscribe = followTaps ? onBigEmojiTap(() => {
            gaze.stopAnimation();
            Animated.timing(gaze, { toValue: { x: 0, y: 1 }, duration: 250, useNativeDriver: true }).start();
            clearTimeout(timeout);
            timeout = setTimeout(wander, 3000);
        }) : undefined;
        return () => { clearTimeout(timeout); unsubscribe?.(); };
    }, [face, followTaps]);

    const unit = size / 100;
    const lit = STARS.slice(0, stars);
    // Each star twinkles at its own point in the loop
    const phases = useMemo(() => lit.map((_, i) => (i * 0.37) % 1), [stars]);

    return (
        <View style={{ width: size, height: size }} pointerEvents="none">
            {face ? (
                <View style={[StyleSheet.absoluteFill, { opacity: faceOpacity }]}>
                    <Svg width={size} height={size} viewBox="0 0 100 100">
                        <Path d={HEAD} stroke={palette.lilacLight} strokeWidth={0.9} fill="none" strokeLinejoin="round" />
                        <Path d={SMILE} stroke={palette.lilacLight} strokeWidth={0.9} fill="none" strokeLinecap="round" />
                        {EYES.map(eye => <Circle key={eye.x} cx={eye.x} cy={eye.y} r={4.5} stroke={palette.lilacLight} strokeWidth={0.8} fill="none" />)}
                    </Svg>
                    {EYES.map(eye => (
                        <Animated.View
                            key={eye.x}
                            style={[styles.pupil, {
                                width: 3 * unit,
                                height: 3 * unit,
                                borderRadius: 1.5 * unit,
                                left: (eye.x - 1.5) * unit,
                                top: (eye.y - 1.5) * unit,
                                transform: [
                                    // Both look towards the middle when they look down at the Big Emoji
                                    { translateX: Animated.add(Animated.multiply(gaze.x, unit * 1.6), Animated.multiply(gaze.y, (eye.x < 50 ? 1 : -1) * unit * 0.6)) },
                                    { translateY: Animated.multiply(gaze.y, unit * 1.4) },
                                ],
                            }]}
                        />
                    ))}
                </View>
            ) : null}
            {lit.map((star, i) => {
                const isNewest = i === lit.length - 1;
                const phase = phases[i];
                const range = [0, phase, Math.min(phase + 0.15, 0.999), 1];
                const opacity = twinkle.interpolate({ inputRange: range, outputRange: [0.45, 0.45, 0.9, 0.45] });
                return (
                    <Animated.Text
                        key={i}
                        style={[styles.star, {
                            fontSize: 4.5 * unit,
                            lineHeight: 5 * unit,
                            width: 6 * unit,
                            left: (star.x - 3) * unit,
                            top: (star.y - 2.5) * unit,
                            opacity: isNewest ? Animated.multiply(opacity, newest) : opacity,
                            transform: isNewest ? [{ scale: newest.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.2, 1.8, 1] }) }] : [],
                        }]}
                    >
                        ✦
                    </Animated.Text>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    pupil: {
        position: "absolute",
        backgroundColor: "#FFFFFF",
    },
    star: {
        position: "absolute",
        textAlign: "center",
        color: "#FFFFFF",
    },
});
