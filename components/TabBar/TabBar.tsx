import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from "react-native";
import TabButton from "./TabButton";
import { componentColors, colors } from "../misc/Colors";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";

interface TabBarProps {
    height?: number;
}

export default function TabBar(props: TabBarProps) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { height = 100 } = props;

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Only render TabBar if the keyboard is not visible
    if (isKeyboardVisible) return null;

    return (
        <View style={[styles.container, { height: height }]}>
            <TabButton
                onPress={() => navigation.navigate("Emoji")}
                label="Emoji"
                icon="😀"
                background={componentColors.tabBar.home.background}
                highlight={componentColors.tabBar.home.highlight}
            />
            <TabButton
                onPress={() => navigation.navigate("Buildings")}
                label="Buildings"
                icon="🏛️"
                background={colors.yellow.medium}
                highlight={colors.yellow.highlight}
            />
            <TabButton
                onPress={() => navigation.navigate("Upgrades")}
                label="Upgrades"
                icon="💡"
                background={componentColors.tabBar.browse.background}
                highlight={componentColors.tabBar.browse.highlight}
            />
            <TabButton
                onPress={() => navigation.navigate("Emojidex")}
                label="Emojidex"
                icon="📖"
                background={componentColors.tabBar.daily.background}
                highlight={componentColors.tabBar.daily.highlight}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        flexDirection: "row",
        gap: 20,
        // borderTopWidth: 2.5,
        // borderColor: "white",
        // backgroundColor: colors.purple.medium,
        // padding: 10,
        justifyContent: "center",
        alignItems: "center",
    }
})