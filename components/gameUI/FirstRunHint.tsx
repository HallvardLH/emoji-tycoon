import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Text from "../generalUI/Text";
import { palette, radii, themedStyles } from "../misc/theme";
import { useIsDesktop } from "../layout/desktop";

// Taps before the first hint goes away, if no building has been bought by then
const TAP_HINT_TAPS = 15;

type Hint = "tap" | "shop" | null;

/**
 * Hints for a brand new game: tap the Big Emoji, then buy the first building.
 * Each goes away once it's done, and none show again after the first building.
 */
export default function FirstRunHint() {
    // Narrow selector: one of three values, so it re-renders only when the hint changes
    const hint = useSelector((state: RootState): Hint => {
        const hasBuilding = state.buildings.buildings.some(building => building.amount > 0);
        if (hasBuilding || state.prestige.prestiges > 0) return null;
        const firstPrice = state.buildings.buildings[0]?.price ?? Infinity;
        if (state.values.emojis >= firstPrice) return "shop";
        if (state.stats.bigEmojiTaps < TAP_HINT_TAPS) return "tap";
        return null;
    });

    // On desktop the buildings are in the column to the right, not behind a tab
    const isDesktop = useIsDesktop();

    if (!hint) return null;
    const text = hint === "tap"
        ? "👆 Tap the emoji to draw emojis!"
        : isDesktop ? "✍️ Hire a Drawing hand in Buildings →" : "🛒 Open the Shop and hire a Drawing hand";
    return <HintBubble key={hint} text={text} />;
}

function HintBubble({ text }: { text: string }) {
    const bob = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(Animated.sequence([
            Animated.timing(bob, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(bob, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]));
        loop.start();
        return () => loop.stop();
    }, []);

    const style = useMemo(() => ({
        transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }],
    }), []);

    return (
        <Animated.View
            pointerEvents="none"
            accessibilityLiveRegion="polite"
            style={[styles.bubble, style]}
        >
            <Text font="black" size={15} color={palette.ink}>{text}</Text>
        </Animated.View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    bubble: {
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: radii.pill,
        backgroundColor: palette.sun,
    },
}));
