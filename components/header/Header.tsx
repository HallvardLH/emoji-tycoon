import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "expo-router";
import Text from "../generalUI/Text";
import HomeNavigation from "../drawer/HomeNavigation";
import store from "../../scripts/redux/reduxStore";
import PrestigeMeter from "../gameUI/Meters/PrestigeMeter";
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";
import { getGameSpeed, useGameSpeed } from "../../scripts/game/gameSpeed";
import { getLastTickTime } from "../../scripts/game/gameLoop";
import { useIsDesktop } from "../layout/desktop";
import { palette, radii, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";
import i18n, { getLanguage } from "../../i18n";

/**
 * The header itself subscribes to nothing that changes often. The bank changes
 * every game tick, so only the small counters below subscribe to it; otherwise the
 * whole header, including the menu and its cheat drawer, re-rendered 10 times a second.
 */
export default function Header() {
    const pathname = usePathname();
    const { t } = useTranslation();

    const isDesktop = useIsDesktop();
    const isHome = pathname === "/";
    const isEmojidex = pathname.startsWith("/emojidex");

    // On desktop the counter and buttons sit above the Big Emoji instead (StageHeader)
    if (isDesktop) return null;

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            {isHome ? (
                // Home: the bank is the hero
                <HomeCounter />
            ) : isEmojidex ? (
                <Text size={30} style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{t("tabs.emojidex")}</Text>
            ) : (
                // Shop: compact counter so the list gets the room.
                // The rate sits on its own line so it stays put while the total ticks up.
                <View style={styles.compactCounter}>
                    <Text size={28} style={{ lineHeight: 30 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}><Bank /></Text>
                    <RateBump origin="left">
                        <Text font="bold" size={13} color={palette.sun} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}><Rate /></Text>
                    </RateBump>
                </View>
            )}
            <HomeNavigation />
        </SafeAreaView>
    )
}

/** The bank as the hero: big count, the rate, and emoji essence */
function HomeCounter() {
    const { t } = useTranslation();
    return (
        <View style={styles.bigCounter}>
            <Text font="black" size={12} color={palette.lilac} style={styles.caps}>{t("header.emojis").toLocaleUpperCase(getLanguage())}</Text>
            {/* Long number names, like "quattuordecillion", shrink instead of pushing the menu button aside */}
            <Text size={40} style={{ lineHeight: 44 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}><Bank /></Text>
            <View style={styles.pills}>
                <RateBump glow style={styles.epsPill}>
                    <Text font="bold" size={14} color={palette.sun} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}><Rate /></Text>
                </RateBump>
                <PrestigeMeter />
                <GemsPill />
            </View>
        </View>
    );
}

/** Desktop: the home header at the top of the Big Emoji's column, with the cheats and menu buttons */
export function StageHeader() {
    return (
        <View style={styles.container}>
            <HomeCounter />
            <HomeNavigation />
        </View>
    );
}

/**
 * The bank, counting up every frame rather than in 10-a-second game ticks
 *
 * Between ticks it projects the bank forward at the current production, never past
 * where the next tick will land. It reads the store directly each frame and only
 * re-renders when the shown text changes, so the header itself stays still.
 */
const Bank = React.memo(() => {
    const [text, setText] = useState(() => formatBank(store.getState().values.emojis));

    useEffect(() => {
        let frame: number;
        let shown = text;

        const step = () => {
            const { emojis, emojisPerSecond } = store.getState().values;
            // Projected from the last tick, not the last change: taps change the bank between
            // ticks, and restarting the projection on each one made the count crawl while tapping.
            // At most one game tick ahead, so it never runs past the real bank
            const sinceTick = (Date.now() - getLastTickTime()) / 1000;
            const ahead = Math.min(sinceTick, 0.1) * emojisPerSecond * getGameSpeed();
            const next = formatBank(emojis + Math.max(0, ahead));
            if (next !== shown) {
                shown = next;
                setText(next);
            }
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, []);

    return <>{text}</>;
});

/** Whole numbers with separators, then three decimals from a million up ("24.231 million") */
const formatBank = (emojis: number) => emojis < 1e6 ? formatNumber(Math.floor(emojis)) : formatNumber(emojis, 3);

/** Gems, the premium currency. Opens the gem store */
function GemsPill() {
    const router = useRouter();
    const { t } = useTranslation();
    const gems = useSelector((state: RootState) => state.gems.gems);
    return (
        <Pressable
            onPress={() => router.push("/gems")}
            accessibilityRole="button"
            accessibilityLabel={t("header.gemsLabel", { count: gems, gems: formatNumber(gems) })}
            style={({ pressed }) => [styles.epsPill, styles.gemsPill, pressed ? { opacity: 0.8 } : null]}
        >
            <Text font="bold" size={14} color="#FFFFFF">💎 {formatNumber(gems)}</Text>
            {/* A button of its own, so it reads as "get more" */}
            <View style={styles.gemsPlus}>
                <Text font="black" size={14} color={palette.ink} style={{ lineHeight: 16 }}>+</Text>
            </View>
        </Pressable>
    );
}

/** Emojis per second, e.g. "+12.1 million / sec", with ⏩ while the debug speed is on. The app remounts on a language change */
const Rate = React.memo(() => {
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);
    const speed = useGameSpeed();
    return <>{speed > 1 ? "⏩ " : ""}{i18n.t("header.rate", { value: formatNumber(emojisPerSecond * speed, 1) })}</>;
});

// How long the bump on a production increase lasts
const BUMP_MS = 450;
// Right after loading, the save coming in raises production from nothing; no increase to celebrate
const SETTLE_MS = 1500;

/**
 * Pops its children, and flashes a glow behind them with `glow`, each time production
 * goes up (a purchase, an upgrade, a boost starting). Drops in production stay quiet.
 */
function RateBump({ children, glow, origin = "center", style }: { children: ReactNode, glow?: boolean, origin?: "left" | "center", style?: object }) {
    const bump = useRef(new Animated.Value(1)).current;
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);
    const previous = useRef(emojisPerSecond);
    const mountedAt = useRef(Date.now());

    useEffect(() => {
        const increased = emojisPerSecond > previous.current;
        previous.current = emojisPerSecond;
        if (!increased || Date.now() - mountedAt.current < SETTLE_MS) return;
        // Restarts on each increase, so buying in quick succession keeps it bouncing
        bump.setValue(0);
        Animated.timing(bump, { toValue: 1, duration: BUMP_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    }, [emojisPerSecond]);

    const bumpStyle = useMemo(() => ({
        transformOrigin: origin,
        transform: [{ scale: bump.interpolate({ inputRange: [0, 0.25, 1], outputRange: [1, 1.18, 1] }) }],
    }), [origin]);
    const glowStyle = useMemo(() => ({
        opacity: bump.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
    }), []);

    return (
        <Animated.View style={[style, bumpStyle]}>
            {glow && <Animated.View pointerEvents="none" style={[styles.bumpGlow, glowStyle]} />}
            {children}
        </Animated.View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 4,
        backgroundColor: palette.grape,
    },
    bigCounter: {
        gap: 4,
        // Takes what the menu button leaves, so the pills wrap instead of pushing it off screen
        flex: 1,
        minWidth: 0,
        marginRight: 12,
    },
    caps: {
        letterSpacing: 1.4,
    },
    // The rate, emoji essence once it shows up, and gems
    pills: {
        flexDirection: "row",
        // Same height pills
        alignItems: "stretch",
        // Late-game rates get long; essence drops to its own line rather than off screen
        flexWrap: "wrap",
        gap: 8,
        marginTop: 2,
    },
    epsPill: {
        justifyContent: "center",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: radii.pill,
        backgroundColor: palette.glass,
    },
    gemsPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingRight: 5,
    },
    gemsPlus: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: palette.sun,
        alignItems: "center",
        justifyContent: "center",
    },
    // Flashes over the rate pill when production goes up
    bumpGlow: {
        ...StyleSheet.absoluteFill,
        borderRadius: radii.pill,
        backgroundColor: "rgba(255,197,61,0.35)",
    },
    compactCounter: {
        minHeight: 44,
    },
    title: {
        lineHeight: 44,
    },
}))
