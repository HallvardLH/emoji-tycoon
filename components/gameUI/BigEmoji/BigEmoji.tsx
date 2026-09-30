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
import { getComboProgress } from '../../../scripts/game/tapBoost';
import EffectBurst from '../EffectBurst';
import ComboRain from './ComboRain';
import store from '../../../scripts/redux/reduxStore';
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
    color: string;
    size: number;
}

// "+N" numbers get bigger and warmer as the combo rises: ×1 white → ×5 hot pink
const COMBO_NUMBER_COLORS = ["#FFFFFF", "#FFE08A", palette.sun, "#FF9F43", palette.pop];
function comboNumberStyle(multiplier: number) {
    const level = Math.min(multiplier, COMBO_NUMBER_COLORS.length) - 1;
    return { color: COMBO_NUMBER_COLORS[level], size: 26 + level * 5 };
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

    // Celebrations for shiny emojis that were just tapped
    const [shinyBursts, setShinyBursts] = useState<{ id: number, amount: number }[]>([]);

    // 1 at rest, lower while pressed
    const squish = useRef(new Animated.Value(1)).current;

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

        // Add new animating number, styled by the current combo
        const { multiplier } = getComboProgress(store.getState().bigEmoji.tapBoost);
        animatingNumbers.current.push({
            key: `${uniqueKey}-num`,
            number: `+${formatNumber(emojisPerTapDisplay, 1)}`,
            yAnimValue: numberYAnimValue,
            xAnimValue: numberXAnimValue,
            ...comboNumberStyle(multiplier),
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

        const shinyReward = tapEmoji();
        if (shinyReward !== undefined) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShinyBursts(current => [...current, { id: Date.now() + Math.random(), amount: shinyReward }]);
        }
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

            {/* Emoji shower behind the stage when the combo maxes out */}
            <ComboRain />

            <View style={styles.stage}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={bigEmoji.shiny ? "Tap the shiny Big Emoji" : "Tap the Big Emoji"}
                onPress={() => {
                    onEmojiTap();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                }}
                // Squash down on press, then spring back with a wobble on release
                onPressIn={() => Animated.spring(squish, { toValue: 0.86, tension: 400, friction: 12, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(squish, { toValue: 1, tension: 220, friction: 4, useNativeDriver: true }).start()}
                style={[styles.disc, bigEmoji.shiny ? styles.discShiny : null]}>
                {bigEmoji.shiny && <ShinyGlow />}
                {/* Static Emoji */}
                <Animated.View style={{
                    transform: [
                        // Wider as it gets shorter, so it squashes rather than shrinks
                        { scaleX: squish.interpolate({ inputRange: [0.8, 1, 1.2], outputRange: [1.12, 1, 0.9] }) },
                        { scaleY: squish },
                    ],
                }}>
                    <PulseAnimation maxSize={1.06} duration={4000}>
                        <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                    </PulseAnimation>
                </Animated.View>

                {animatingEmojis.current.map(({ key, emoji, yAnimValue, xAnimValue }) => (
                    <FlyingEmoji
                        key={key}
                        emoji={emoji}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                    />
                ))}

                {animatingNumbers.current.map(({ key, number, yAnimValue, xAnimValue, color, size }) => (
                    <FlyingNumber
                        key={key}
                        number={number}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                        color={color}
                        size={size}
                    />
                ))}
            </Pressable>
                {bigEmoji.shiny && (
                    <View style={styles.shinyTag} pointerEvents="none">
                        <GameText font="black" size={12} color={palette.ink} style={{ letterSpacing: 1 }}>✨ SHINY ✨</GameText>
                    </View>
                )}
                {shinyBursts.map(burst => (
                    <EffectBurst
                        key={burst.id}
                        headline="✨ SHINY!"
                        value={`+${formatNumber(burst.amount < 1e6 ? Math.floor(burst.amount) : burst.amount, 1)}`}
                        caption="EMOJIS"
                        sparks={["✨", "🌟", "💛", "⭐", "🪙", "✨", "🌟", "💛", "⭐", "🪙", "✨", "🌟"]}
                        color={palette.sun}
                        x={DISC / 2}
                        y={DISC / 2}
                        onDone={() => setShinyBursts(current => current.filter(b => b.id !== burst.id))}
                    />
                ))}
            </View>

            <ComboMeter />
            <GameText font="bold" size={13} color={palette.lilac}>
                +{formatNumber(emojisPerTap, 1)} per tap · keep tapping to build your combo
            </GameText>
        </View>
    );
}

// Where the twinkles sit around a shiny emoji, relative to the disc's inner area
const TWINKLES = [
    { left: 22, top: 26, size: 22, delay: 0 },
    { left: 150, top: 18, size: 18, delay: 350 },
    { left: 160, top: 140, size: 24, delay: 700 },
    { left: 16, top: 136, size: 16, delay: 1050 },
];

/** A gold glow and twinkling sparkles behind a shiny Big Emoji */
function ShinyGlow() {
    const twinkle = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(Animated.timing(twinkle, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }));
        loop.start();
        return () => loop.stop();
    }, []);

    const inner = DISC - 28;
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={inner} height={inner} style={StyleSheet.absoluteFill}>
                <Defs>
                    <RadialGradient id="shinyGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor={palette.sun} stopOpacity="0.75" />
                        <Stop offset="60%" stopColor={palette.sun} stopOpacity="0.25" />
                        <Stop offset="100%" stopColor={palette.sun} stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx={inner / 2} cy={inner / 2} r={inner / 2} fill="url(#shinyGlow)" />
            </Svg>
            {TWINKLES.map((t, i) => {
                // Each twinkle peaks at a different point in the loop
                const phase = t.delay / 1400;
                const range = [0, phase, Math.min(phase + 0.25, 0.999), 1];
                return (
                    <Animated.Text
                        key={i}
                        style={{
                            position: 'absolute',
                            left: t.left,
                            top: t.top,
                            fontSize: t.size,
                            opacity: twinkle.interpolate({ inputRange: range, outputRange: [0.15, 0.15, 1, 0.15] }),
                            transform: [{ scale: twinkle.interpolate({ inputRange: range, outputRange: [0.6, 0.6, 1.2, 0.6] }) }],
                        }}
                    >
                        ✨
                    </Animated.Text>
                );
            })}
        </View>
    );
}

/**
 * Shows the hidden tap boost: every 10 boost adds ×1 to emojis per tap.
 * The five segments fill up towards the next multiplier.
 */
function ComboMeter() {
    const tapBoost = useSelector((state: RootState) => state.bigEmoji.tapBoost);
    const { multiplier, progress, isMax } = getComboProgress(tapBoost);
    const idle = tapBoost === 0;

    return (
        <View style={[styles.combo, idle ? { opacity: 0.55 } : null]}>
            <GameText size={16} color={palette.sun}>{isMax ? `MAX COMBO ×${multiplier}` : `COMBO ×${multiplier}`}</GameText>
            {/* Five segments that fill smoothly towards the next multiplier */}
            <View style={styles.comboSegments}>
                {[0, 1, 2, 3, 4].map(i => {
                    const fill = Math.max(0, Math.min(1, progress * 5 - i));
                    return (
                        <View key={i} style={styles.comboSegment}>
                            <View style={[styles.comboSegmentFill, { width: `${fill * 100}%` }]} />
                        </View>
                    );
                })}
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
    // Holds the disc, its shiny tag and shiny celebrations, which spill outside it
    stage: {
        width: DISC,
        height: DISC,
    },
    discShiny: {
        backgroundColor: 'rgba(255,197,61,0.12)',
        borderColor: palette.sun,
    },
    shinyTag: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: radii.pill,
        backgroundColor: palette.sun,
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
        backgroundColor: palette.glassLine,
        overflow: 'hidden',
    },
    comboSegmentFill: {
        height: 8,
        backgroundColor: palette.sun,
    },
});
