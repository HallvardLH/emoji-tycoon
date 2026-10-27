import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import * as Haptics from "../../scripts/game/haptics";
import Text from "../generalUI/Text";
import { Milestone, onMilestone } from "../../scripts/game/milestones";
import { palette, radii, themedStyles } from "../misc/theme";
import i18n from "../../i18n";

// How long each banner stays up
const SHOW_FOR = 3200;
const SPARKS = ["✨", "🎉", "⭐", "✨", "🎊", "⭐"];
const ICON = 58;
const GLOW = 96;

/**
 * Milestone banners that drop in from the top over any screen.
 * Milestones that happen together are shown one after another.
 */
export default function MilestoneToast() {
    const [queue, setQueue] = useState<(Milestone & { id: number })[]>([]);

    useEffect(() => onMilestone(milestone => {
        setQueue(current => [...current, { ...milestone, id: Date.now() + Math.random() }]);
    }), []);

    const current = queue[0];
    if (!current) return null;

    return (
        <Banner
            key={current.id}
            milestone={current}
            onDone={() => setQueue(q => q.slice(1))}
        />
    );
}

/** Each kind of banner has its own colour */
function accentOf(kind: Milestone["kind"]) {
    switch (kind) {
        case "trophy": return { color: palette.sun, ledge: palette.sunLedge };
        case "building": return { color: "#5BE39A", ledge: palette.green };
        case "prestige": return { color: palette.pop, ledge: "#C23A57" };
        case "gems": return { color: "#7DD3FC", ledge: "#2B7FD9" };
        default: return { color: palette.lilac, ledge: palette.violet };
    }
}

function Banner({ milestone, onDone }: { milestone: Milestone, onDone: () => void }) {
    const insets = useSafeAreaInsets();
    const accent = accentOf(milestone.kind);
    const slide = useRef(new Animated.Value(0)).current;
    const burst = useRef(new Animated.Value(0)).current;
    // The icon pops in a moment after the card lands
    const pop = useRef(new Animated.Value(0)).current;
    // A light sweep across the card, once
    const shine = useRef(new Animated.Value(0)).current;
    // 1 → 0 while the banner is up: how long until it goes
    const timer = useRef(new Animated.Value(1)).current;
    const [width, setWidth] = useState(0);

    const sparks = useMemo(() => SPARKS.map((emoji, i) => {
        const angle = (i / SPARKS.length) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 44 + Math.random() * 24;
        return { emoji, dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance };
    }), []);

    const show = useRef<Animated.CompositeAnimation | null>(null);
    const countdown = useRef<Animated.CompositeAnimation | null>(null);
    const dismissed = useRef(false);

    useEffect(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        show.current = Animated.sequence([
            Animated.spring(slide, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
            Animated.delay(SHOW_FOR),
            Animated.timing(slide, { toValue: 0, duration: 300, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]);
        show.current.start(({ finished }) => { if (finished) onDone(); });
        countdown.current = Animated.sequence([
            Animated.delay(300),
            Animated.timing(timer, { toValue: 0, duration: SHOW_FOR, easing: Easing.linear, useNativeDriver: true }),
        ]);
        countdown.current.start();
        Animated.sequence([
            Animated.delay(120),
            Animated.spring(pop, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        ]).start();
        Animated.sequence([
            Animated.delay(150),
            Animated.timing(burst, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();
        Animated.sequence([
            Animated.delay(350),
            Animated.timing(shine, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]).start();
    }, []);

    // Tapping the banner sends it away early
    const dismiss = () => {
        if (dismissed.current) return;
        dismissed.current = true;
        show.current?.stop();
        countdown.current?.stop();
        Animated.timing(slide, { toValue: 0, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onDone);
    };

    return (
        <View style={[styles.wrapper, { top: insets.top + 10 }]} pointerEvents="box-none">
            <Pressable onPress={dismiss} accessibilityRole="button" accessibilityHint={i18n.t("common.dismissHint")} style={styles.pressable}>
            <Animated.View
                accessibilityLiveRegion="polite"
                accessibilityLabel={`${milestone.caption}: ${milestone.title}`}
                onLayout={e => setWidth(e.nativeEvent.layout.width)}
                style={[styles.card, { borderBottomColor: accent.ledge }, {
                    opacity: slide,
                    transform: [
                        { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) },
                        { scale: slide.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                    ],
                }]}
            >
                {/* Clipped to the card: the shine and the timer bar */}
                <View style={styles.clip} pointerEvents="none">
                    {width > 0 && (
                        <Animated.View style={[styles.shine, {
                            transform: [
                                { translateX: shine.interpolate({ inputRange: [0, 1], outputRange: [-80, width + 40] }) },
                                { rotate: "20deg" },
                            ],
                        }]} />
                    )}
                    <Animated.View style={[styles.timer, {
                        backgroundColor: accent.color,
                        transform: [{ scaleX: timer }],
                    }]} />
                </View>

                <View style={styles.iconArea}>
                    {/* A soft glow in the banner's colour */}
                    <Svg width={GLOW} height={GLOW} style={styles.glow} pointerEvents="none">
                        <Defs>
                            <RadialGradient id="toastGlow" cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={accent.color} stopOpacity="0.55" />
                                <Stop offset="100%" stopColor={accent.color} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx={GLOW / 2} cy={GLOW / 2} r={GLOW / 2} fill="url(#toastGlow)" />
                    </Svg>
                    {sparks.map((spark, i) => (
                        <Animated.Text
                            key={i}
                            style={[styles.spark, {
                                opacity: burst.interpolate({ inputRange: [0, 0.2, 0.7, 1], outputRange: [0, 1, 1, 0] }),
                                transform: [
                                    { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dx] }) },
                                    { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, spark.dy] }) },
                                    { scale: burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1.1, 0.7] }) },
                                ],
                            }]}
                        >
                            {spark.emoji}
                        </Animated.Text>
                    ))}
                    <Animated.View style={[styles.iconRing, { borderColor: accent.color }, {
                        transform: [
                            { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
                            { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ["-25deg", "0deg"] }) },
                        ],
                    }]}>
                        <Text size={30} style={{ lineHeight: 38 }}>{milestone.icon}</Text>
                    </Animated.View>
                </View>

                <View style={styles.text}>
                    <View style={[styles.chip, { backgroundColor: accent.color }]}>
                        <Text font="black" size={10} color={palette.ink} style={styles.caption} numberOfLines={1}>{milestone.caption}</Text>
                    </View>
                    <Text size={19} color="#FFFFFF" numberOfLines={2} style={{ lineHeight: 23 }}>{milestone.title}</Text>
                </View>
            </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 16,
        right: 16,
        alignItems: "center",
        zIndex: 100,
        elevation: 100,
    },
    pressable: {
        width: "100%",
        maxWidth: 380,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.night,
        borderWidth: 1,
        borderColor: palette.glassLine,
        // A coloured ledge underneath, like the game's buttons
        borderBottomWidth: 5,
        shadowColor: "#000",
        shadowOpacity: 0.45,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
    },
    clip: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: radii.xl,
        overflow: "hidden",
    },
    shine: {
        position: "absolute",
        top: -40,
        bottom: -40,
        width: 36,
        backgroundColor: "rgba(255,255,255,0.12)",
    },
    timer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        opacity: 0.8,
        transformOrigin: "left",
    },
    iconArea: {
        width: ICON,
        height: ICON,
        alignItems: "center",
        justifyContent: "center",
    },
    glow: {
        position: "absolute",
        left: (ICON - GLOW) / 2,
        top: (ICON - GLOW) / 2,
    },
    iconRing: {
        width: ICON,
        height: ICON,
        borderRadius: ICON / 2,
        borderWidth: 2,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    spark: {
        position: "absolute",
        fontSize: 18,
    },
    text: {
        flex: 1,
        gap: 5,
        alignItems: "flex-start",
    },
    chip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radii.pill,
        maxWidth: "100%",
    },
    caption: {
        letterSpacing: 1.1,
    },
}));
