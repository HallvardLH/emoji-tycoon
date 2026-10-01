import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { markAffordableUpgradesSeen } from "../../scripts/redux/upgradesSlice";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import SegmentedControl from "../generalUI/SegmentedControl";
import { RootState } from "../../scripts/redux/reduxStore";
import { palette } from "../misc/theme";

/** Buildings / Upgrades switch at the top of the Shop */
export default function TopTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    const dispatch = useDispatch();
    // Affordable upgrades the player hasn't seen on the Upgrades tab yet
    const newAffordableUpgrades = useSelector((s: RootState) => {
        const seen = s.upgrades.seenCanBuy ?? [];
        return s.upgrades.canBuy.filter(id => !seen.includes(id)).length;
    });
    const upgradesOpen = state.routes[state.index]?.name === "Upgrades";

    // While the Upgrades tab is open, whatever is affordable counts as seen
    useEffect(() => {
        if (upgradesOpen && newAffordableUpgrades > 0) dispatch(markAffordableUpgradesSeen());
    }, [upgradesOpen, newAffordableUpgrades]);

    const segments = state.routes.map((route) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title ?? route.name;
        return {
            label,
            badge: route.name === "Upgrades" ? newAffordableUpgrades : undefined,
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
