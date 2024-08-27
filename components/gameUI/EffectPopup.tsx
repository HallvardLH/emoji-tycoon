import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import Emoji from "./Emoji";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { tapEffect } from "../../scripts/game/effects/onScreenEffects";
import { Effect } from "../../scripts/game/effects/createEffect";
import PulseAnimation from "../animations/PulseAnimation";

export default function EffectPopup() {
    const { effectsOnScreen } = useSelector((state: RootState) => state.effects);

    return (
        <>
            {effectsOnScreen.map((effect) => (
                <FadeInOutEffect key={effect.id} effect={effect} />
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
                opacity: fadeAnim, // Bind opacity to animated value
            }}
        >
            <PulseAnimation maxSize={1.1} duration={2000}>
                <Pressable onPress={() => tapEffect(effect.id)}>
                    <Emoji icon={effect.emoji} size={70} />
                </Pressable>
            </PulseAnimation>
        </Animated.View>
    );
}