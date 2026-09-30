import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, Pressable, Text, Animated, View, Easing, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import { tapEmoji, pickNextEmoji } from '../../../scripts/game/bigEmoji';
import PulseAnimation from '../../animations/PulseAnimation';
import { formatNumber } from '../../../scripts/misc';
import * as Haptics from 'expo-haptics';
import { FlyingEmoji, FlightPath, makeFlightPath, makeFloatPath } from './FlyingEmoji';
import { FlyingNumber } from './FlyingNumber';
import { TapSparks, Spark, makeSparks } from './TapSparks';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import GameText from '../../generalUI/Text';
import { getComboProgress, getMaxComboMultiplier, BOOST_PER_MULTIPLIER } from '../../../scripts/game/tapBoost';
import EffectBurst from '../EffectBurst';
import ComboRain from './ComboRain';
import store from '../../../scripts/redux/reduxStore';
import { howFun } from '../../../scripts/game/shorthands';
import { palette, radii } from '../../misc/theme';
// import { useFonts } from "expo-font";

interface AnimatedEmoji {
    key: string;
    emoji: string;
    progress: Animated.Value;
    path: FlightPath;
}

interface AnimatedNumber {
    key: string;
    number: string;
    progress: Animated.Value;
    x: number;
    y: number;
    tilt: number;
    color: string;
    size: number;
}

interface AnimatedSparks {
    key: string;
    progress: Animated.Value;
    sparks: Spark[];
    color: string;
}

// How long each piece of a tap lasts
const EMOJI_FLIGHT_MS = 650;
const FLOAT_FLIGHT_MS = 1000;
const NUMBER_FLIGHT_MS = 900;
const SPARKS_MS = 480;
const RING_MS = 520;
// Rings expanding from the disc on each tap, reused round-robin
const RING_COUNT = 3;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const randomSign = () => (Math.random() < 0.5 ? -1 : 1);

// "+N" numbers get bigger and warmer as the combo rises: ×1 white → ×5 hot pink
const COMBO_NUMBER_COLORS = ["#FFFFFF", "#FFE08A", palette.sun, "#FF9F43", palette.pop];
function comboNumberStyle(multiplier: number) {
    const level = Math.min(multiplier, COMBO_NUMBER_COLORS.length) - 1;
    return { color: COMBO_NUMBER_COLORS[level], size: 26 + level * 5 };
}

export default function BigEmoji() {
    // Select only what this renders. The bigEmoji slice also holds the combo, which
    // changes every 100ms; subscribing to the whole slice re-rendered the entire
    // stage (and every animation on it) ten times a second.
    const bigEmoji = useSelector((state: RootState) => state.bigEmoji.bigEmoji);
    const emojisPerTap = useSelector((state: RootState) => state.bigEmoji.emojisPerTap);

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

    const animatingSparks = useRef<AnimatedSparks[]>([]);

    // 1 at rest, lower while pressed
    const squish = useRef(new Animated.Value(1)).current;
    // The next emoji pops in from small with an overshoot
    const popIn = useRef(new Animated.Value(1)).current;
    // -1…1, a knock to one side that wobbles back to upright
    const tilt = useRef(new Animated.Value(0)).current;
    // Shockwave rings, and the colour each was last fired in
    const rings = useRef(Array.from({ length: RING_COUNT }, () => new Animated.Value(1))).current;
    const ringColors = useRef<string[]>(Array(RING_COUNT).fill(palette.lilac));
    const nextRing = useRef(0);

    useEffect(() => {
        setEmojisPerTapDisplay(emojisPerTap);
    }, [emojisPerTap]);

    const onEmojiTap = useCallback(() => {
        const animatingEmoji = staticEmoji;
        const nextPickedEmoji = pickNextEmoji();
        setStaticEmoji(nextPickedEmoji as string);

        const { multiplier } = getComboProgress(store.getState().bigEmoji.tapBoost);
        const comboStyle = comboNumberStyle(multiplier);
        // Everything hits a little harder as the combo climbs
        const intensity = Math.min(multiplier - 1, 7) / 7;

        const uniqueKey = `${nextPickedEmoji}-${Date.now()}-${Math.random()}`;

        // The tapped emoji is knocked off to one side: a hop, then it tumbles down under gravity.
        // Fun value 31 - 40 (low gravity): it drifts up and away instead
        const direction = randomSign();
        const lowGravity = howFun(31, 40);
        const emojiProgress = new Animated.Value(0);
        animatingEmojis.current.push({
            key: uniqueKey,
            emoji: animatingEmoji,
            progress: emojiProgress,
            path: lowGravity
                ? makeFloatPath(LOW_GRAVITY_RISE, direction * randomBetween(30, 110), direction * randomBetween(5, 20))
                : makeFlightPath(
                    randomBetween(25, 45) + intensity * 15,
                    FALL_DISTANCE,
                    direction * randomBetween(60, 170),
                    // A gentle lean in the direction it's thrown, not a spin
                    direction * randomBetween(15, 35) * (1 + intensity * 0.5),
                ),
        });
        if (animatingEmojis.current.length > 25) {
            animatingEmojis.current = animatingEmojis.current.slice(-25);
        }

        // The "+N" number, styled by the current combo, rises on the opposite side
        const numberProgress = new Animated.Value(0);
        animatingNumbers.current.push({
            key: `${uniqueKey}-num`,
            number: `+${formatNumber(emojisPerTapDisplay, 1)}`,
            progress: numberProgress,
            x: -direction * randomBetween(10, 70),
            y: -randomBetween(120, 210),
            tilt: -direction * randomBetween(4, 14),
            ...comboStyle,
        });
        if (animatingNumbers.current.length > 25) {
            animatingNumbers.current = animatingNumbers.current.slice(-25);
        }

        // Sparks from ×2 up, more of them the higher the combo
        let sparksProgress: Animated.Value | undefined;
        if (multiplier >= 2) {
            sparksProgress = new Animated.Value(0);
            animatingSparks.current.push({
                key: `${uniqueKey}-sparks`,
                progress: sparksProgress,
                sparks: makeSparks(3 + Math.min(multiplier, 8)),
                color: comboStyle.color,
            });
            if (animatingSparks.current.length > 6) {
                animatingSparks.current = animatingSparks.current.slice(-6);
            }
        }

        forceUpdate(x => x + 1);

        const remove = () => {
            animatingEmojis.current = animatingEmojis.current.filter(item => item.key !== uniqueKey);
            animatingNumbers.current = animatingNumbers.current.filter(item => item.key !== `${uniqueKey}-num`);
            animatingSparks.current = animatingSparks.current.filter(item => item.key !== `${uniqueKey}-sparks`);
            forceUpdate(x => x + 1);
        };

        Animated.parallel([
            Animated.timing(emojiProgress, {
                toValue: 1,
                duration: lowGravity ? FLOAT_FLIGHT_MS : EMOJI_FLIGHT_MS,
                // The path is already shaped by gravity, so time runs evenly
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(numberProgress, {
                toValue: 1,
                duration: NUMBER_FLIGHT_MS,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            ...(sparksProgress ? [Animated.timing(sparksProgress, {
                toValue: 1,
                duration: SPARKS_MS,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })] : []),
        ]).start(remove);

        // The new emoji pops in
        popIn.setValue(0.55);
        Animated.spring(popIn, { toValue: 1, tension: 320, friction: 6, useNativeDriver: true }).start();

        // Knocked away from the side the old emoji flew off to, then wobbles back
        tilt.setValue(-direction * (0.5 + intensity * 0.5));
        Animated.spring(tilt, { toValue: 0, tension: 260, friction: 5, useNativeDriver: true }).start();

        // A shockwave ring in the combo colour
        const ring = nextRing.current;
        nextRing.current = (ring + 1) % RING_COUNT;
        ringColors.current[ring] = comboStyle.color;
        rings[ring].setValue(0);
        Animated.timing(rings[ring], { toValue: 1, duration: RING_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

        const shinyReward = tapEmoji();
        if (shinyReward !== undefined) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShinyBursts(current => [...current, { id: Date.now() + Math.random(), amount: shinyReward }]);
        }
    }, [staticEmoji, emojisPerTapDisplay]);

    const staticEmojiStyle = useMemo(() => ({
        transform: [
            { rotate: tilt.interpolate({ inputRange: [-1, 1], outputRange: ["-12deg", "12deg"] }) },
            // Wider as it gets shorter, so it squashes rather than shrinks
            { scaleX: squish.interpolate({ inputRange: [0.8, 1, 1.2], outputRange: [1.12, 1, 0.9] }) },
            { scaleY: squish },
            { scale: popIn },
        ],
    }), []);


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
            {rings.map((ring, i) => (
                <Animated.View
                    key={i}
                    pointerEvents="none"
                    style={[styles.ring, {
                        borderColor: ringColors.current[i],
                        opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
                        transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.3] }) }],
                    }]}
                />
            ))}
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

                {animatingSparks.current.map(({ key, progress, sparks, color }) => (
                    <TapSparks key={key} progress={progress} sparks={sparks} color={color} />
                ))}

                {/* Static Emoji */}
                <Animated.View style={staticEmojiStyle}>
                    <PulseAnimation maxSize={1.06} duration={4000}>
                        <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                    </PulseAnimation>
                </Animated.View>

                {animatingEmojis.current.map(({ key, emoji, progress, path }) => (
                    <FlyingEmoji key={key} emoji={emoji} progress={progress} path={path} />
                ))}

                {animatingNumbers.current.map(({ key, number, progress, x, y, tilt, color, size }) => (
                    <FlyingNumber
                        key={key}
                        number={number}
                        progress={progress}
                        x={x}
                        y={y}
                        tilt={tilt}
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
 * One segment per combo level; the one filling is the level you're on.
 */
function ComboMeter() {
    const tapBoost = useSelector((state: RootState) => state.bigEmoji.tapBoost);
    const { multiplier, isMax } = getComboProgress(tapBoost);
    // Selected so a newly bought combo level shows straight away, not on the next tap
    const maxMultiplier = useSelector(() => getMaxComboMultiplier());
    const idle = tapBoost === 0;

    // One segment per level, ×1 up to the max. The segment filling is the level you're on:
    // ×1 fills as you start tapping, then ×2 while you're at ×2, and so on. The top
    // segment (pink) is the stretch above the max threshold, i.e. how long you can
    // keep max combo going. Each segment is BOOST_PER_MULTIPLIER boost wide.
    const segmentCount = maxMultiplier;
    const totalBoost = segmentCount * BOOST_PER_MULTIPLIER;
    // Narrower segments once there are many, so the bar stays phone-width up to ×8 and beyond
    const segmentWidth = segmentCount > 7 ? 15 : 20;

    // The combo updates every 100ms; glide between updates instead of jumping
    const fill = useRef(new Animated.Value(tapBoost / totalBoost)).current;
    useEffect(() => {
        Animated.timing(fill, {
            toValue: tapBoost / totalBoost,
            duration: 110,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [tapBoost, totalBoost]);

    const segments = useMemo(() => Array.from({ length: segmentCount }, (_, i) => {
        return {
            label: `×${i + 1}`,
            // The level you're at while this segment fills
            level: i + 1,
            isTop: i === segmentCount - 1,
            fillStyle: {
                transform: [{
                    scaleX: fill.interpolate({ inputRange: [i / segmentCount, (i + 1) / segmentCount], outputRange: [0, 1], extrapolate: "clamp" }),
                }],
            },
        };
    }), [segmentCount]);

    return (
        <View
            style={[styles.combo, idle ? { opacity: 0.55 } : null]}
            accessibilityLabel={`Combo times ${multiplier}${isMax ? ", max" : ""}`}
        >
            <View style={styles.comboSegments}>
                {segments.map(segment => {
                    // Levels you're at or past light up; nothing is lit before you start tapping
                    const lit = !idle && multiplier >= segment.level;
                    return (
                        <View key={segment.label} style={styles.comboSegmentColumn}>
                            <View style={[styles.comboSegment, { width: segmentWidth }]}>
                                <Animated.View style={[
                                    styles.comboSegmentFill,
                                    segment.isTop ? { backgroundColor: palette.pop } : null,
                                    segment.fillStyle,
                                ]} />
                            </View>
                            <GameText
                                font="black"
                                size={9}
                                color={lit ? (segment.isTop ? palette.pop : palette.sun) : palette.lilac}
                                style={styles.comboSegmentLabel}
                            >
                                {segment.label}
                            </GameText>
                        </View>
                    );
                })}
            </View>
            <GameText size={16} color={palette.sun}>{isMax ? `MAX COMBO ×${multiplier}` : `COMBO ×${multiplier}`}</GameText>
        </View>
    );
}

const SPOTLIGHT = 500;
// How far tapped emojis float up with low gravity
const LOW_GRAVITY_RISE = 260;
// How far below the disc centre tapped emojis tumble to
const FALL_DISTANCE = 240;
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
    ring: {
        position: 'absolute',
        width: DISC,
        height: DISC,
        borderRadius: DISC / 2,
        borderWidth: 4,
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
    // The bar on top, the "COMBO ×N" text centred underneath
    combo: {
        alignItems: 'center',
        gap: 6,
        paddingTop: 10,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderRadius: radii.lg,
        backgroundColor: palette.shade,
    },
    comboSegments: {
        flexDirection: 'row',
        gap: 4,
    },
    comboSegmentColumn: {
        alignItems: 'center',
        gap: 2,
    },
    comboSegmentLabel: {
        lineHeight: 11,
        opacity: 0.9,
    },
    comboSegment: {
        width: 20,
        height: 8,
        borderRadius: 3,
        backgroundColor: palette.glassLine,
        overflow: 'hidden',
    },
    comboSegmentFill: {
        // Full width, scaled from its left edge (a transform animates without layout work)
        width: '100%',
        height: 8,
        backgroundColor: palette.sun,
        transformOrigin: 'left',
    },
});
