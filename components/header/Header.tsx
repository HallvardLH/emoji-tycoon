import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { usePathname } from "expo-router";
import Text from "../generalUI/Text";
import AnimatedNumber from "../gameUI/AnimatedNumber";
import HomeNavigation from "../drawer/HomeNavigation";
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";
import { palette, radii } from "../misc/theme";

/**
 * The header itself subscribes to nothing that changes often. The bank changes
 * every game tick, so only the small counters below subscribe to it; otherwise the
 * whole header, including the menu and its cheat drawer, re-rendered 10 times a second.
 */
export default function Header() {
    const pathname = usePathname();

    const isHome = pathname === "/";
    const isEmojidex = pathname.startsWith("/emojidex");

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            {isHome ? (
                // Home: the bank is the hero
                <View style={styles.bigCounter}>
                    <Text font="black" size={12} color={palette.lilac} style={styles.caps}>EMOJIS</Text>
                    <Text size={40} style={{ lineHeight: 44 }}><Bank /></Text>
                    <View style={styles.epsPill}>
                        <Text font="bold" size={14} color={palette.sun}><Rate /></Text>
                    </View>
                </View>
            ) : isEmojidex ? (
                <Text size={30} style={styles.title}>Emojidex</Text>
            ) : (
                // Shop: compact counter so the list gets the room.
                // The rate sits on its own line so it stays put while the total ticks up.
                <View style={styles.compactCounter}>
                    <Text size={28} style={{ lineHeight: 30 }}><Bank /></Text>
                    <Text font="bold" size={13} color={palette.sun}><Rate /></Text>
                </View>
            )}
            <HomeNavigation />
        </SafeAreaView>
    )
}

/** The bank, the only part of the header that changes every tick */
const Bank = React.memo(() => {
    const emojis = useSelector((state: RootState) => state.values.emojis);
    return <AnimatedNumber value={emojis} />;
});

/** Emojis per second, e.g. "+12.1 million / sec" */
const Rate = React.memo(() => {
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);
    return <>+{formatNumber(emojisPerSecond, 1)} / sec</>;
});

const styles = StyleSheet.create({
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
    },
    caps: {
        letterSpacing: 1.4,
    },
    epsPill: {
        alignSelf: "flex-start",
        marginTop: 2,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: radii.pill,
        backgroundColor: palette.glass,
    },
    compactCounter: {
        minHeight: 44,
    },
    title: {
        lineHeight: 44,
    },
})
