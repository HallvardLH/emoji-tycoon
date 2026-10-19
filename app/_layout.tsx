import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import store from "../scripts/redux/reduxStore";
import { gameLoop } from "../scripts/game/gameLoop";
import { preloadRewardedAd } from "../scripts/ads";
import Header from "../components/header/Header";
import MilestoneToast from "../components/gameUI/MilestoneToast";
import OfflineModal from "../components/gameUI/OfflineModal";
import ResetModal from "../components/gameUI/ResetModal";
import { useFonts } from "expo-font";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Nunito_700Bold, Nunito_700Bold_Italic, Nunito_800ExtraBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { palette } from "../components/misc/theme";

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
    useEffect(() => { preloadRewardedAd(); }, []);

    // Game loop
    useEffect(() => {
        const intervalId = setInterval(gameLoop, 100);
        return () => clearInterval(intervalId);
    }, []);

    if (!fontsLoaded) {
        return <View style={styles.container} />;
    }

    return (
        <Provider store={store}>
            <View style={styles.container}>
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
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.grape,
    },
});
