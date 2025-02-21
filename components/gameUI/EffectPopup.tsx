import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
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
            <PulseAnimation maxSize={1.1} duration={2000}>
                <Pressable onPress={() => tapEffect(effect.instanceId!)}>
                    <Emoji icon={effect.emoji} size={70} />
                </Pressable>
            </PulseAnimation>
        </Animated.View>
    );
}
