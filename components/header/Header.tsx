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

export default function Header() {
    const pathname = usePathname();
    const emojis = useSelector((state: RootState) => state.values.emojis);
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);

    const isHome = pathname === "/";
    const isEmojidex = pathname.startsWith("/emojidex");

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            {isHome ? (
                // Home: the bank is the hero
                <View style={styles.bigCounter}>
                    <Text font="black" size={12} color={palette.lilac} style={styles.caps}>EMOJIS</Text>
                    <Text size={40} style={{ lineHeight: 44 }}><AnimatedNumber value={emojis} /></Text>
                    <View style={styles.epsPill}>
                        <Text font="bold" size={14} color={palette.sun}>+{formatNumber(emojisPerSecond, 1)} / sec</Text>
                    </View>
                </View>
            ) : isEmojidex ? (
                <Text size={30} style={styles.title}>Emojidex</Text>
            ) : (
                // Shop: compact counter so the list gets the room
                <View style={styles.compactCounter}>
                    <Text size={28}><AnimatedNumber value={emojis} /></Text>
                    <Text font="bold" size={13} color={palette.sun}>+{formatNumber(emojisPerSecond, 1)}/s</Text>
                </View>
            )}
            <HomeNavigation />
        </SafeAreaView>
    )
}

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
        flexDirection: "row",
        alignItems: "baseline",
        gap: 10,
        minHeight: 44,
        paddingTop: 4,
    },
    title: {
        lineHeight: 44,
    },
})
