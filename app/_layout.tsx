import "../i18n";
import { Stack } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useLocales } from "expo-localization";
import store, { RootState } from "../scripts/redux/reduxStore";
import { applyLanguagePreference } from "../i18n";
import { gameLoop } from "../scripts/game/gameLoop";
import Header from "../components/header/Header";

export default function RootLayout() {
    // Game loop
    useEffect(() => {
        const intervalId = setInterval(gameLoop, 100);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Provider store={store}>
            <LocalizedApp />
        </Provider>
    );
}

function LocalizedApp() {
    // Older saves have no language preference
    const languagePreference = useSelector((state: RootState) => state.preferences.language) ?? "system";
    // Changes when the device language changes, which matters when following the device language
    const deviceLocales = useLocales();
    const { i18n } = useTranslation();

    useEffect(() => {
        applyLanguagePreference(languagePreference);
    }, [languagePreference, deviceLocales]);

    // Remount the app when the language changes, so that every text,
    // including formatted numbers outside of components, is rendered in the new language
    return (
        <View key={i18n.language} style={styles.container}>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    header: (props) => <Header {...props} />,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
