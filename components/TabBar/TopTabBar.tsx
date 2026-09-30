import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import SegmentedControl from "../generalUI/SegmentedControl";
import { RootState } from "../../scripts/redux/reduxStore";
import { palette } from "../misc/theme";

/** Buildings / Upgrades switch at the top of the Shop */
export default function TopTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    // Upgrades you can afford right now
    const affordableUpgrades = useSelector((s: RootState) => s.upgrades.canBuy.length);

    const segments = state.routes.map((route) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title ?? route.name;
        return {
            label,
            badge: route.name === "Upgrades" ? affordableUpgrades : undefined,
            onPress: () => navigation.navigate(route.name),
        };
    });

    return (
        <View style={styles.container}>
            <SegmentedControl segments={segments} activeIndex={state.index} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 12,
        paddingHorizontal: 20,
        backgroundColor: palette.grape,
    },
});
