import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import store from "../scripts/redux/reduxStore";
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
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Stack
                    screenOptions={{
                        header: (props) => <Header {...props} />,
                    }}
                />
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
