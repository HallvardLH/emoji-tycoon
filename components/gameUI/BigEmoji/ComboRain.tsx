import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../scripts/redux/reduxStore";
import { getComboProgress } from "../../../scripts/game/tapBoost";
import { selectRandomEmoji } from "../../../scripts/game/bigEmoji";

const DROPS = 30;
// The shower lasts about this long, from first drop to last landing
const SHOWER_MS = 3000;
// Minimum time between showers
const COOLDOWN_MS = 8000;

/**
 * A short shower of emojis behind the stage whenever the combo hits max.
 * (EmojiRain is the endless background rain; this is a one-off celebration.)
 */
export default function ComboRain() {
    const isMax = useSelector((state: RootState) => getComboProgress(state.bigEmoji.tapBoost).isMax);
    const [showers, setShowers] = useState<number[]>([]);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const wasMax = useRef(isMax);
    const lastShower = useRef(0);

    // Start a shower each time the combo reaches max, not while it stays there.
    // The cooldown stops a combo hovering right at the threshold from retriggering it.
    useEffect(() => {
        const now = Date.now();
        if (isMax && !wasMax.current && now - lastShower.current > COOLDOWN_MS) {
            lastShower.current = now;
            setShowers(current => [...current, now]);
        }
        wasMax.current = isMax;
    }, [isMax]);

    return (
        <View
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
            onLayout={(e: LayoutChangeEvent) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
            {size.width > 0 && showers.map(id => (
                <Shower
                    key={id}
                    width={size.width}
                    height={size.height}
                    onDone={() => setShowers(current => current.filter(s => s !== id))}
                />
            ))}
        </View>
    );
}

function Shower({ width, height, onDone }: { width: number, height: number, onDone: () => void }) {
    const drops = useMemo(() => Array.from({ length: DROPS }, () => ({
        emoji: selectRandomEmoji().emoji,
        x: Math.random() * (width - 40),
        size: 24 + Math.random() * 18,
        delay: Math.random() * 900,
        duration: 1400 + Math.random() * 700,
        spin: `${Math.round(Math.random() * 360 - 180)}deg`,
        fall: new Animated.Value(0),
    })), []);

    useEffect(() => {
        Animated.parallel(drops.map(drop => Animated.sequence([
            Animated.delay(drop.delay),
            Animated.timing(drop.fall, { toValue: 1, duration: drop.duration, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]))).start();
        const timeout = setTimeout(onDone, SHOWER_MS);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            {drops.map((drop, i) => (
                <Animated.Text
                    key={i}
                    style={{
                        position: "absolute",
                        left: drop.x,
                        top: -60,
                        fontSize: drop.size,
                        opacity: drop.fall.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 0.8, 0.8, 0] }),
                        transform: [
                            { translateY: drop.fall.interpolate({ inputRange: [0, 1], outputRange: [0, height + 120] }) },
                            { rotate: drop.fall.interpolate({ inputRange: [0, 1], outputRange: ["0deg", drop.spin] }) },
                        ],
                    }}
                >
                    {drop.emoji}
                </Animated.Text>
            ))}
        </>
    );
}
