import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import store from "../scripts/redux/reduxStore";
import { gameLoop } from "../scripts/game/gameLoop";
import Header from "../components/header/Header";
import MilestoneToast from "../components/gameUI/MilestoneToast";
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
