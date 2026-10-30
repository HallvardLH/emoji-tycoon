import "../i18n";
import "../scripts/screenshotMode";
import "../scripts/screenshotHooks";
import { Stack } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import store, { RootState, whenSaveLoaded } from "../scripts/redux/reduxStore";
import { useTranslation } from "react-i18next";
import { useLocales } from "expo-localization";
import { applyLanguagePreference } from "../i18n";
import { gameLoop } from "../scripts/game/gameLoop";
import { preloadRewardedAd } from "../scripts/ads";
import { ADS_ENABLED } from "../scripts/monetization";
import Header from "../components/header/Header";
import MilestoneToast from "../components/gameUI/MilestoneToast";
import OfflineModal from "../components/gameUI/OfflineModal";
import ResetModal from "../components/gameUI/ResetModal";
import ScreenshotCheatsTrigger from "../components/drawer/ScreenshotCheatsTrigger";
import { useFonts } from "expo-font";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Nunito_700Bold, Nunito_700Bold_Italic, Nunito_800ExtraBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { palette, themedStyles, applyPalette, useThemeVersion } from "../components/misc/theme";
import { themeById } from "../scripts/game/gems/themes";
// Fonts for languages the game's fonts cannot display, see i18n/fonts.ts
import { RussoOne_400Regular } from "@expo-google-fonts/russo-one/400Regular";
import { Baloo2_800ExtraBold } from "@expo-google-fonts/baloo-2/800ExtraBold";
import { BalooDa2_800ExtraBold } from "@expo-google-fonts/baloo-da-2/800ExtraBold";
import { Commissioner_900Black } from "@expo-google-fonts/commissioner/900Black";
import { Kanit_700Bold } from "@expo-google-fonts/kanit/700Bold";
import { Lalezar_400Regular } from "@expo-google-fonts/lalezar/400Regular";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        LilitaOne_400Regular,
        Nunito_700Bold,
        Nunito_700Bold_Italic,
        Nunito_800ExtraBold,
        Nunito_900Black,
        "Digitalt": require("../assets/fonts/Digitalt.otf"),
        "RussoOne": RussoOne_400Regular,
        "Baloo2": Baloo2_800ExtraBold,
        "BalooDa2": BalooDa2_800ExtraBold,
        "Commissioner": Commissioner_900Black,
        "Kanit": Kanit_700Bold,
        "Lalezar": Lalezar_400Regular,
    });

    // Web: it's a game, not a page. Tapping fast selected the Big Emoji and other text,
    // and pressing and moving could drag emojis and images off
    useEffect(() => {
        if (Platform.OS !== "web") return;
        const style = document.createElement("style");
        style.textContent = `
            * { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; }
            input, textarea { user-select: text; -webkit-user-select: text; }
        `;
        document.head.appendChild(style);
        // Firefox has no -webkit-user-drag
        const preventDrag = (event: DragEvent) => event.preventDefault();
        document.addEventListener("dragstart", preventDrag);
        return () => {
            style.remove();
            document.removeEventListener("dragstart", preventDrag);
        };
    }, []);

    // Ready before the welcome back screen asks for one
    useEffect(() => { if (ADS_ENABLED) preloadRewardedAd(); }, []);

    // The save loads asynchronously (slowly on some phones). Nothing runs or shows until it's
    // in: the game's startup checks, migrations and the welcome back offer all read it, and
    // taps on a fresh game in the meantime would be thrown away when it arrived
    const [saveLoaded, setSaveLoaded] = useState(false);
    useEffect(() => {
        let cancelled = false;
        whenSaveLoaded().then(() => {
            if (cancelled) return;
            // The app theme (gems) colours everything, so it's on before anything shows
            applyPalette(themeById(store.getState().gems.theme).colours);
            setSaveLoaded(true);
        });
        return () => { cancelled = true; };
    }, []);

    // Game loop
    useEffect(() => {
        if (!saveLoaded) return;
        const intervalId = setInterval(gameLoop, 100);
        return () => clearInterval(intervalId);
    }, [saveLoaded]);

    if (!fontsLoaded || !saveLoaded) {
        return <View style={styles.container} />;
    }

    return (
        <Provider store={store}>
            <LocalizedApp />
        </Provider>
    );
}

/**
 * The app, in the player's language and the colours of their app theme. Changing either
 * remounts everything, so every text (formatted numbers outside of components too) and
 * every style (rebuilt for the new palette, see themedStyles) picks it up
 */
function LocalizedApp() {
    // Older saves have no language preference
    const languagePreference = useSelector((state: RootState) => state.preferences.language) ?? "system";
    // Changes when the device language changes, which matters when following the device language
    const deviceLocales = useLocales();
    const { i18n } = useTranslation();

    useEffect(() => {
        applyLanguagePreference(languagePreference);
    }, [languagePreference, deviceLocales]);

    const themeId = useSelector((state: RootState) => state.gems.theme);
    useEffect(() => {
        const { colours } = themeById(themeId);
        // Only when it's really a different theme: the first one went on with the save
        if (colours.grape !== palette.grape || colours.sun !== palette.sun || colours.paper !== palette.paper) {
            applyPalette(colours);
        }
    }, [themeId]);
    const themeVersion = useThemeVersion();

    return (
        <View key={`${i18n.language}-${themeVersion}`} style={styles.container}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    header: () => <Header />,
                    // iOS 26 headers are transparent by default, which slid the screens under the Header
                    headerTransparent: false,
                }}
            >
                {/* Modals from the start. Set from inside the screens, they were pushed as regular
                    screens and switched to modals once on screen, which iOS can re-present */}
                <Stack.Screen name="gems" options={{ headerShown: false, presentation: "modal" }} />
                <Stack.Screen name="prestige" options={{ headerShown: false, presentation: "modal" }} />
            </Stack>
            {/* Over every screen, as milestones can happen anywhere */}
            <MilestoneToast />
            <OfflineModal />
            <ResetModal />
            <ScreenshotCheatsTrigger />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.grape,
    },
}));
