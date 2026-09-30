import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View, StyleSheet } from "react-native";
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

    return (
        <>
            {effectsOnScreen.map((effect) => (
                <FadeInOutEffect key={effect.instanceId} effect={effect} />
            ))}
        </>
    );
}

interface FadeInOutEffectProps {
    effect: Effect;
}

function FadeInOutEffect({ effect }: FadeInOutEffectProps) {
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
                left: effect.xPos,
                top: effect.yPos,
                marginTop: effect.margin ? effect.margin / 2 : 25,
                marginLeft: effect.margin ? effect.margin / 2 : 25,
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

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        gap: 2,
    },
    glowWrap: {
        width: GLOW,
        height: GLOW,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        letterSpacing: 0.8,
    },
})
