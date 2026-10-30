import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { RootState } from "../../scripts/redux/reduxStore";
import Text from "../generalUI/Text";
import Modal from "../generalUI/Modal";
import GemPowers from "./GemPowers";
import ChunkyButton from "../generalUI/ChunkyButton";
import { boostSecondsLeft, formatCountdown, BOOST_MULTIPLIER } from "../../scripts/game/gems/boost";
import { formatNumber } from "../../scripts/misc";
import { palette, radii, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";
import { toCaps } from "../../scripts/utils";

/**
 * The gem powers button, bottom left of the Big Emoji. Shows the boost counting down
 * while it's on; opens the gem powers. Hidden until the first building, like the
 * rest of the game around the Big Emoji
 */
export default function BoostButton() {
    const { t } = useTranslation();
    const show = useSelector((state: RootState) =>
        state.prestige.prestiges > 0 || state.buildings.buildings.some(building => building.amount > 0));
    const gems = useSelector((state: RootState) => state.gems.gems);
    const boostUntil = useSelector((state: RootState) => state.gems.boostUntil ?? 0);
    const [open, setOpen] = useState(false);
    const { height } = useWindowDimensions();

    // Counts down once a second while the boost is on
    const [secondsLeft, setSecondsLeft] = useState(() => boostSecondsLeft());
    useEffect(() => {
        setSecondsLeft(boostSecondsLeft());
        if (boostUntil <= Date.now()) return;
        const id = setInterval(() => setSecondsLeft(boostSecondsLeft()), 1000);
        return () => clearInterval(id);
    }, [boostUntil]);
    const active = secondsLeft > 0;

    // A slow glow while the boost is on
    const glow = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (!active) { glow.setValue(0); return; }
        const loop = Animated.loop(Animated.sequence([
            Animated.timing(glow, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(glow, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]));
        loop.start();
        return () => loop.stop();
    }, [active]);

    if (!show) return null;

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={active ? t("gemPowers.buttonActiveA11y", { time: formatCountdown(secondsLeft) }) : t("gemPowers.buttonA11y")}
                style={({ pressed }) => [styles.button, active ? styles.buttonActive : null, pressed ? { transform: [{ scale: 0.94 }] } : null]}
            >
                {active && <Animated.View pointerEvents="none" style={[styles.glow, { opacity: glow }]} />}
                <Text size={24} style={{ lineHeight: 28 }}>{active ? "⚡" : "💎"}</Text>
                {/* One line in a fixed-width button: longer words (Turkish "GÜÇLENDİR") shrink rather than wrap */}
                <Text font="black" size={10} color={active ? palette.sun : palette.lilac} style={{ letterSpacing: 0.6, maxWidth: SIZE - 6 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                    {active ? formatCountdown(secondsLeft) : toCaps(t("gemPowers.buttonCaps"))}
                </Text>
            </Pressable>

            <Modal modalVisible={open} onRequestClose={() => setOpen(false)}>
                <View style={styles.sheet}>
                    <View style={styles.sheetHead}>
                        <View style={{ flex: 1 }}>
                            <Text size={24} style={{ lineHeight: 30 }}>{t("gemPowers.title")}</Text>
                            <Text font="bold" size={13} color={palette.lilac}>
                                {active ? t("gemPowers.boostOn", { multiplier: BOOST_MULTIPLIER, time: formatCountdown(secondsLeft) }) : t("gemPowers.subtitle")}
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => { setOpen(false); router.push("/gems"); }}
                            accessibilityRole="button"
                            accessibilityLabel={t("header.gemsLabel", { count: gems, gems: formatNumber(gems) })}
                            style={({ pressed }) => [styles.gemPill, pressed ? { opacity: 0.8 } : null]}
                        >
                            <Text font="black" size={14} color="#FFFFFF">💎 {formatNumber(gems)} +</Text>
                        </Pressable>
                    </View>
                    <ScrollView style={{ maxHeight: height * 0.55 }} contentContainerStyle={{ paddingBottom: 4 }}>
                        <GemPowers />
                    </ScrollView>
                    <ChunkyButton
                        height={50}
                        labelSize={17}
                        label={`💎 ${t("gemPowers.getMoreGems")}`}
                        onPress={() => { setOpen(false); router.push("/gems"); }}
                    />
                </View>
            </Modal>
        </>
    );
}

const SIZE = 60;

const styles = themedStyles(() => StyleSheet.create({
    button: {
        width: SIZE,
        height: SIZE,
        borderRadius: radii.lg,
        backgroundColor: palette.glass,
        borderWidth: 1,
        borderColor: palette.glassLine,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonActive: {
        borderColor: palette.sun,
        backgroundColor: "rgba(255,197,61,0.12)",
    },
    glow: {
        ...StyleSheet.absoluteFill,
        borderRadius: radii.lg,
        backgroundColor: "rgba(255,197,61,0.22)",
    },
    sheet: {
        alignSelf: "stretch",
        maxWidth: 440,
        width: "100%",
        marginHorizontal: "auto",
        gap: 12,
        padding: 14,
        borderRadius: radii.xl,
        backgroundColor: palette.grape,
        borderWidth: 1,
        borderColor: palette.glassLine,
    },
    sheetHead: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    gemPill: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radii.pill,
        backgroundColor: palette.glass,
    },
}));
