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

export default function EffectPopup() {
    const { effectsOnScreen } = useSelector((state: RootState) => state.effects);
    // The real size of the play area (between the header and the tab bar)
    const [area, setArea] = useState({ width: 0, height: 0 });

    return (
        <View
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
            onLayout={(e: LayoutChangeEvent) => setArea({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        >
            {area.width > 0 && effectsOnScreen.map((effect) => (
                <FadeInOutEffect key={effect.instanceId} effect={effect} area={area} />
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
}

function FadeInOutEffect({ effect, area }: FadeInOutEffectProps) {
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
                left: toPixels(effect.xPos, area.width, EFFECT_WIDTH),
                top: toPixels(effect.yPos, area.height, EFFECT_HEIGHT),
                width: EFFECT_WIDTH,
                height: EFFECT_HEIGHT,
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Collect ${effect.title}`}
                onPress={() => tapEffect(effect.instanceId!)}
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
