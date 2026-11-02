import { useEffect, useRef, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import store from "../../scripts/redux/reduxStore";
import { starCount, showsFace, MAX_STARS } from "../../scripts/game/prestige/story";
import { traits } from "../../scripts/game/prestige/traits";
import { MAX_PERK_TIER } from "../../scripts/game/prestige/perks";
import { TRIALS_UNLOCK_PRESTIGES } from "../../scripts/game/prestige/trials";
import { formatNumber } from "../../scripts/misc";
import { getTraitName } from "../../i18n/content";
import * as Haptics from "../../scripts/game/haptics";
import Text from "../generalUI/Text";
import ChunkyButton from "../generalUI/ChunkyButton";
import { palette, radii, themedStyles } from "../misc/theme";
import { toCaps } from "../../scripts/utils";
import Sky from "../gameUI/Sky";

const COUNT_MS = 1400;

/**
 * The moment after a prestige: the world folds away, the essence counts up, what the
 * prestige opened up is listed, and a new star lights up in the sky (the story, see
 * story.ts). Tap to skip ahead.
 */
export default function AscensionReveal({ essence, gems, onContinue }: { essence: number, gems: number, onContinue: () => void }) {
    const { t } = useTranslation();
    const { prestiges } = store.getState().prestige;
    const stars = starCount();
    const newStar = prestiges <= MAX_STARS;
    // The sky comes in once the essence has counted up, so its new star is seen arriving
    const [showSky, setShowSky] = useState(false);

    const burst = useRef(new Animated.Value(0)).current;
    const count = useRef(new Animated.Value(0)).current;
    const details = useRef(new Animated.Value(0)).current;
    const story = useRef(new Animated.Value(0)).current;
    const [shown, setShown] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const id = count.addListener(({ value }) => setShown(Math.round(value)));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const sequence = Animated.sequence([
            Animated.spring(burst, { toValue: 1, friction: 5, tension: 40, useNativeDriver: false }),
            Animated.timing(count, { toValue: essence, duration: COUNT_MS, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
            Animated.timing(details, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.delay(200),
        ]);
        sequence.start(({ finished }) => {
            if (!finished) return;
            setShowSky(true);
            Animated.timing(story, { toValue: 1, duration: 900, useNativeDriver: false }).start(() => setDone(true));
        });
        return () => { sequence.stop(); count.removeListener(id); };
    }, []);

    /** Tapping during the reveal shows everything at once */
    const skip = () => {
        if (done) return;
        [burst, details, story].forEach(value => { value.stopAnimation(); value.setValue(1); });
        count.stopAnimation();
        count.setValue(essence);
        setShowSky(true);
        setDone(true);
    };

    // What this prestige opened up
    const unlocks: string[] = [];
    if (prestiges <= MAX_PERK_TIER) unlocks.push(t("ascension.unlockPerkTier", { tier: prestiges }));
    traits.filter(trait => trait.unlockAt === prestiges).forEach(trait => unlocks.push(t("ascension.unlockTrait", { icon: trait.icon, name: getTraitName(trait) })));
    if (prestiges === TRIALS_UNLOCK_PRESTIGES) unlocks.push(t("ascension.unlockTrials"));

    const fadeUp = (value: Animated.Value) => ({
        opacity: value,
        transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
    });

    return (
        <View style={styles.screen}>
            <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
                <Pressable style={{ flex: 1 }} onPress={skip} accessible={false}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Animated.View style={[styles.burst, { opacity: burst, transform: [{ scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }] }]}>
                            <View style={styles.halo} />
                            <Text size={96} style={{ lineHeight: 112 }}>✨</Text>
                        </Animated.View>

                        <Animated.View style={{ alignItems: "center", gap: 4, opacity: burst }}>
                            <Text font="black" size={12} color={palette.lilac} style={styles.caps}>{toCaps(t("ascension.runComplete", { count: prestiges }))}</Text>
                            <Text size={48} color={palette.sun} style={{ lineHeight: 56 }}>+{formatNumber(shown)}</Text>
                            <Text font="bold" size={15} color={palette.lilacLight}>{t("ascension.essenceGained")}</Text>
                        </Animated.View>

                        {gems > 0 || unlocks.length > 0 ? <Animated.View style={[styles.unlocks, fadeUp(details)]}>
                            {gems > 0 ? <Text font="bold" size={14} color={palette.lilacLight}>+{gems} 💎</Text> : null}
                            {unlocks.map(line => (
                                <Text key={line} font="bold" size={14} color="#FFFFFF" style={{ textAlign: "center" }}>{line}</Text>
                            ))}
                        </Animated.View> : null}

                        {showSky ? (
                            <Animated.View style={[styles.sky, { opacity: story }]}>
                                <Sky size={300} stars={stars} face={showsFace()} faceOpacity={0.2} revealNewest={newStar} />
                            </Animated.View>
                        ) : <View style={styles.skySpace} />}
                    </ScrollView>
                </Pressable>
                <View style={styles.footer}>
                    <ChunkyButton
                        height={54}
                        labelSize={18}
                        label={done ? t("ascension.continue") : t("ascension.skip")}
                        onPress={done ? onContinue : skip}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.night,
    },
    content: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 24,
        gap: 20,
    },
    caps: {
        letterSpacing: 1.6,
    },
    burst: {
        width: 180,
        height: 180,
        alignItems: "center",
        justifyContent: "center",
    },
    halo: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: palette.spotlight,
        opacity: 0.6,
    },
    unlocks: {
        alignItems: "center",
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: radii.lg,
        backgroundColor: palette.glassSoft,
    },
    sky: {
        width: 300,
        height: 300,
    },
    skySpace: {
        height: 300,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
}));
