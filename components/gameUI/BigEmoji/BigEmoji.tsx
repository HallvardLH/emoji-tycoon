import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Pressable, Text, Animated, View, Easing, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import { tapEmoji, pickNextEmoji } from '../../../scripts/game/bigEmoji';
import PulseAnimation from '../../animations/PulseAnimation';
import { formatNumber } from '../../../scripts/misc';
import * as Haptics from 'expo-haptics';
import { FlyingEmoji } from './FlyingEmoji';
import { FlyingNumber } from './FlyingNumber';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import GameText from '../../generalUI/Text';
import { palette, radii } from '../../misc/theme';
// import { useFonts } from "expo-font";

interface AnimatedEmoji {
    key: string;
    emoji: string;
    yAnimValue: Animated.Value;
    xAnimValue: Animated.Value;
}

interface AnimatedNumber {
    key: string;
    number: string;
    yAnimValue: Animated.Value;
    xAnimValue: Animated.Value;
}

export default function BigEmoji() {
    const { bigEmoji, nextEmoji, emojisPerTap } = useSelector((state: RootState) => state.bigEmoji);

    // Necessary for using font
    // useFonts({
    //     "Digitalt": require("../../../assets/fonts/Digitalt.otf"),
    // });

    // State for the currently displayed static emoji
    const [staticEmoji, setStaticEmoji] = useState<string>(bigEmoji.emoji);

    // useEffect(() => {
    //     setStaticEmoji(bigEmoji.emoji);
    // }, [bigEmoji.emoji]);

    const [emojisPerTapDisplay, setEmojisPerTapDisplay] = useState<number>(emojisPerTap);

    // State to keep track of multiple animating emojis and numbers
    const animatingEmojis = useRef<AnimatedEmoji[]>([]);
    const animatingNumbers = useRef<AnimatedNumber[]>([]);

    const [, forceUpdate] = useState(0);

    useEffect(() => {
        setEmojisPerTapDisplay(emojisPerTap);
    }, [emojisPerTap]);

    const onEmojiTap = useCallback(() => {
        const animatingEmoji = staticEmoji;
        const nextPickedEmoji = pickNextEmoji();
        setStaticEmoji(nextPickedEmoji as string);

        // Create new animated values for the animating emoji and number
        const newYAnimValue = new Animated.Value(0);
        const newXAnimValue = new Animated.Value(0);
        const numberYAnimValue = new Animated.Value(0);
        const numberXAnimValue = new Animated.Value(0);

        // Random horizontal target value between -200 and 200 for emoji
        const randomXToValueEmoji = Math.floor(Math.random() * 401) - 200;

        // Random movement for number
        const randomYToValueNumber = -(Math.floor(Math.random() * 111) + 110);
        const randomXToValueNumber = Math.floor(Math.random() * 101) - 50;

        // Generate a unique key for the animating emoji and number using the current timestamp
        const uniqueKey = `${nextEmoji}-${Date.now()}`;

        // Add new animating emoji
        animatingEmojis.current.push({
            key: uniqueKey,
            emoji: animatingEmoji,
            yAnimValue: newYAnimValue,
            xAnimValue: newXAnimValue,
        });

        // Cap at 25
        if (animatingEmojis.current.length > 25) {
            animatingEmojis.current = animatingEmojis.current.slice(-25);
        }

        // Add new animating number
        animatingNumbers.current.push({
            key: `${uniqueKey}-num`,
            number: `+${formatNumber(emojisPerTapDisplay, 1)}`,
            yAnimValue: numberYAnimValue,
            xAnimValue: numberXAnimValue,
        });

        // Cap at 25
        if (animatingNumbers.current.length > 25) {
            animatingNumbers.current = animatingNumbers.current.slice(-25);
        }

        forceUpdate(x => x + 1);

        Animated.parallel([
            // Emoji animations
            Animated.sequence([
                Animated.timing(newYAnimValue, {
                    toValue: -30,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(newYAnimValue, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(newXAnimValue, {
                toValue: randomXToValueEmoji,
                duration: 300,
                useNativeDriver: true,
            }),
            // Number animations
            Animated.timing(numberYAnimValue, {
                toValue: randomYToValueNumber,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(numberXAnimValue, {
                toValue: randomXToValueNumber,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
        ]).start(() => {
            // Clean up after animations complete
            animatingEmojis.current = animatingEmojis.current.filter(item => item.key !== uniqueKey);
            animatingNumbers.current = animatingNumbers.current.filter(item => item.key !== `${uniqueKey}-num`);

            // Trigger a render again to remove from UI
            forceUpdate(x => x + 1);
        });

        tapEmoji();
    }, [staticEmoji, emojisPerTapDisplay, nextEmoji]);


    return (
        <View style={styles.container}>
            {/* Spotlight behind the Big Emoji */}
            <Svg style={styles.spotlight} width={SPOTLIGHT} height={SPOTLIGHT} pointerEvents="none">
                <Defs>
                    <RadialGradient id="spotlight" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor={palette.spotlight} stopOpacity="1" />
                        <Stop offset="65%" stopColor={palette.spotlight} stopOpacity="0.35" />
                        <Stop offset="100%" stopColor={palette.grape} stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx={SPOTLIGHT / 2} cy={SPOTLIGHT / 2} r={SPOTLIGHT / 2} fill="url(#spotlight)" />
            </Svg>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tap the Big Emoji"
                onPress={() => {
                    onEmojiTap();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                }}
                style={styles.disc}>
                {/* Static Emoji */}
                <PulseAnimation maxSize={1.06} duration={4000}>
                    <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                </PulseAnimation>

                {animatingEmojis.current.map(({ key, emoji, yAnimValue, xAnimValue }) => (
                    <FlyingEmoji
                        key={key}
                        emoji={emoji}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                    />
                ))}

                {animatingNumbers.current.map(({ key, number, yAnimValue, xAnimValue }) => (
                    <FlyingNumber
                        key={key}
                        number={number}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                    />
                ))}
            </Pressable>

            <ComboMeter />
            <GameText font="bold" size={13} color={palette.lilac}>
                +{formatNumber(emojisPerTap, 1)} per tap · keep tapping to build your combo
            </GameText>
        </View>
    );
}

/**
 * Shows the hidden tap boost: every 10 boost adds ×1 to emojis per tap.
 * The five segments fill up towards the next multiplier.
 */
function ComboMeter() {
    const tapBoost = useSelector((state: RootState) => state.bigEmoji.tapBoost);
    const multiplier = Math.floor(tapBoost / 10) + 1;
    const filled = Math.floor((tapBoost % 10) / 2);
    const idle = tapBoost === 0;

    return (
        <View style={[styles.combo, idle ? { opacity: 0.55 } : null]}>
            <GameText size={16} color={palette.sun}>COMBO ×{multiplier}</GameText>
            <View style={styles.comboSegments}>
                {[0, 1, 2, 3, 4].map(i => (
                    <View key={i} style={[styles.comboSegment, { backgroundColor: i < filled ? palette.sun : palette.glassLine }]} />
                ))}
            </View>
        </View>
    );
}

const SPOTLIGHT = 500;
const DISC = 220;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
    },
    spotlight: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
        marginTop: -SPOTLIGHT / 2 - 40,
    },
    disc: {
        width: DISC,
        height: DISC,
        borderRadius: DISC / 2,
        backgroundColor: palette.glassSoft,
        borderWidth: 14,
        borderColor: 'rgba(255,255,255,0.04)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigEmoji: {
        fontSize: Platform.OS == 'android' ? 130 : 150,
        lineHeight: Platform.OS == 'android' ? 150 : 175,
    },
    combo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radii.pill,
        backgroundColor: palette.shade,
    },
    comboSegments: {
        flexDirection: 'row',
        gap: 4,
    },
    comboSegment: {
        width: 16,
        height: 8,
        borderRadius: 3,
    },
});
