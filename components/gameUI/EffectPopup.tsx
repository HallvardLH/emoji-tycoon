import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import Text from "../generalUI/Text";
import { palette } from "../misc/theme";
import Emoji from "./Emoji";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { tapEffect } from "../../scripts/game/effects/onScreenEffects";
import { Effect } from "../../scripts/game/effects/effectType";
import PulseAnimation from "../animations/PulseAnimation";
import EffectBurst, { Celebration, EFFECT_BURST_WIDTH } from "./EffectBurst";
import { formatNumber } from "../../scripts/misc";

/** What to show when an effect emoji is tapped. `given` is the amount a gift gave. */
function celebrationFor(effect: Effect, given?: number): Celebration {
    const seconds = `${effect.timeLeft} SEC`;

    if (effect.type === "give") {
        const amount = given ?? 0;
        return {
            headline: `${effect.emoji} GIFT!`,
            value: `+${formatNumber(amount < 1e6 ? Math.floor(amount) : amount, 1)}`,
            caption: "EMOJIS",
            sparks: ["✨", "🎉", "⭐", "💫", "🪙", "💰", "✨", "🎊", "⭐", "💰"],
            color: palette.sun,
        };
    }
    if (effect.quality === "bad") {
        return {
            headline: `${effect.emoji} OH NO!`,
            value: `×${effect.epsMult || effect.eptMult}`,
            caption: `${effect.type === "tap" ? "TAPPING" : "PRODUCTION"} · ${seconds}`,
            sparks: ["💥", "💨", "💥", "💨", "💥", "💨", "💥", "💨"],
            color: palette.pop,
        };
    }
    if (effect.type === "tap") {
        return {
            headline: `${effect.emoji} TAP FRENZY!`,
            value: `×${effect.eptMult}`,
            caption: `TAPPING · ${seconds}`,
            sparks: [effect.emoji, "👆", "✨", "💥", effect.emoji, "👆", "✨", "💥", effect.emoji, "⚡"],
            color: palette.sun,
        };
    }
    // Production boosts; the big ones get a louder headline
    const huge = effect.epsMult >= 10;
    return {
        headline: huge ? `${effect.emoji} UNHOLY POWER!` : `${effect.emoji} PRODUCTION BOOST!`,
        value: `×${effect.epsMult}`,
        caption: `PRODUCTION · ${seconds}`,
        sparks: huge
            ? [effect.emoji, "🔥", "⚡", "🔥", effect.emoji, "🔥", "⚡", "🔥", effect.emoji, "🔥", "⚡", "🔥"]
            : [effect.emoji, "✨", "🌟", "✨", effect.emoji, "✨", "🌟", "✨", effect.emoji, "✨"],
        color: palette.sun,
    };
}

export default function EffectPopup() {
    const { effectsOnScreen } = useSelector((state: RootState) => state.effects);
    // The real size of the play area (between the header and the tab bar)
    const [area, setArea] = useState({ width: 0, height: 0 });
    // Celebrations currently playing
    const [bursts, setBursts] = useState<(Celebration & { id: number, x: number, y: number })[]>([]);

    const celebrate = (effect: Effect, given: number | undefined, centerX: number, centerY: number) => {
        // Keep the whole celebration on screen, including the text floating upwards
        const x = Math.min(Math.max(centerX, EFFECT_BURST_WIDTH / 2), area.width - EFFECT_BURST_WIDTH / 2);
        const y = Math.min(Math.max(centerY, 120), area.height - 50);
        setBursts(current => [...current, { ...celebrationFor(effect, given), id: Date.now() + Math.random(), x, y }]);
    };

    return (
        <View
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
            onLayout={(e: LayoutChangeEvent) => setArea({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
            {area.width > 0 && effectsOnScreen.map((effect) => (
                <FadeInOutEffect key={effect.instanceId} effect={effect} area={area} onCollect={celebrate} />
            ))}
            {bursts.map(({ id, ...burst }) => (
                <EffectBurst
                    key={id}
                    {...burst}
                    onDone={() => setBursts(current => current.filter(b => b.id !== id))}
                />
            ))}
        </View>
    );
}

/**
 * Turns a 0 - 1 position into pixels that keep the whole effect inside the area,
 * including the glow's pulse, which grows it by 10%
 */
function toPixels(fraction: number, areaSize: number, effectSize: number) {
    // Clamp, as saves from before positions were fractions hold pixel values
    const clamped = Math.min(1, Math.max(0, fraction));
    const free = Math.max(0, areaSize - effectSize - EDGE_INSET * 2);
    return EDGE_INSET + clamped * free;
}

interface FadeInOutEffectProps {
    effect: Effect;
    area: { width: number, height: number };
    /** Called when the effect is tapped, with what a gift gave and where the effect was */
    onCollect: (effect: Effect, given: number | undefined, centerX: number, centerY: number) => void;
}

function FadeInOutEffect({ effect, area, onCollect }: FadeInOutEffectProps) {
    const left = toPixels(effect.xPos, area.width, EFFECT_WIDTH);
    const top = toPixels(effect.yPos, area.height, EFFECT_HEIGHT);

    const onPress = () => {
        // tapEffect plays the haptic
        const given = tapEffect(effect.instanceId!);
        onCollect(effect, given, left + EFFECT_WIDTH / 2, top + GLOW / 2);
    };

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value: 0

    useEffect(() => {
        // Fade in effect
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // 500ms fade-in duration
            useNativeDriver: true,
        }).start();

        return () => {
            // Fade out effect
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000, // 500ms fade-out duration
                useNativeDriver: true,
            }).start();
        };
    }, [fadeAnim]);

    return (
        <Animated.View
            style={{
                position: "absolute",
                left: left,
                top: top,
                width: EFFECT_WIDTH,
                height: EFFECT_HEIGHT,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Collect ${effect.title}`}
                onPress={onPress}
                style={styles.button}
            >
                <PulseAnimation maxSize={1.1} duration={2000}>
                    <View style={styles.glowWrap}>
                        <Svg style={StyleSheet.absoluteFill} width={GLOW} height={GLOW} pointerEvents="none">
                            <Defs>
                                <RadialGradient id="effectGlow" cx="50%" cy="50%" r="50%">
                                    <Stop offset="0%" stopColor={palette.sun} stopOpacity="0.5" />
                                    <Stop offset="100%" stopColor={palette.sun} stopOpacity="0" />
                                </RadialGradient>
                            </Defs>
                            <Circle cx={GLOW / 2} cy={GLOW / 2} r={GLOW / 2} fill="url(#effectGlow)" />
                        </Svg>
                        <Emoji icon={effect.emoji} size={52} />
                    </View>
                </PulseAnimation>
                <Text font="black" size={12} style={styles.label}>TAP ME</Text>
            </Pressable>
        </Animated.View>
    );
}

const GLOW = 84;
const LABEL_HEIGHT = 16;
const LABEL_GAP = 2;
// The effect's full box: the glow plus the "TAP ME" label under it
const EFFECT_WIDTH = GLOW;
const EFFECT_HEIGHT = GLOW + LABEL_GAP + LABEL_HEIGHT;
// Room for the pulse (up to 1.1×, so 5% of the glow on each side) plus breathing space
const EDGE_INSET = Math.ceil(GLOW * 0.05) + 4;

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        gap: LABEL_GAP,
    },
    glowWrap: {
        width: GLOW,
        height: GLOW,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        letterSpacing: 0.8,
        lineHeight: LABEL_HEIGHT,
    },
})
