import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import store, { whenSaveLoaded } from "../scripts/redux/reduxStore";
import { gameLoop } from "../scripts/game/gameLoop";
import { preloadRewardedAd } from "../scripts/ads";
import { ADS_ENABLED } from "../scripts/monetization";
import Header from "../components/header/Header";
import MilestoneToast from "../components/gameUI/MilestoneToast";
import OfflineModal from "../components/gameUI/OfflineModal";
import ResetModal from "../components/gameUI/ResetModal";
import { useFonts } from "expo-font";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Nunito_700Bold, Nunito_700Bold_Italic, Nunito_800ExtraBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { palette, themedStyles, applyPalette, useThemeVersion } from "../components/misc/theme";
import { themeById } from "../scripts/game/gems/themes";
import { useSelector } from "react-redux";
import { RootState } from "../scripts/redux/reduxStore";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        LilitaOne_400Regular,
        Nunito_700Bold,
        Nunito_700Bold_Italic,
        Nunito_800ExtraBold,
        Nunito_900Black,
        "Digitalt": require("../assets/fonts/Digitalt.otf"),
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
            <ThemedApp />
        </Provider>
    );
}

/**
 * The app, in the colours of the app theme. Switching theme swaps the palette and
 * remounts everything under the new colours (styles are rebuilt, see themedStyles)
 */
function ThemedApp() {
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
        <View key={themeVersion} style={styles.container}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    header: () => <Header />,
                }}
            />
            {/* Over every screen, as milestones can happen anywhere */}
            <MilestoneToast />
            <OfflineModal />
            <ResetModal />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.grape,
    },
}));
