import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { markAffordableUpgradesSeen, selectNewAffordableUpgrades } from "../../scripts/redux/upgradesSlice";
import { MaterialTopTabBarProps } from "expo-router/js-top-tabs";
import SegmentedControl from "../generalUI/SegmentedControl";
import { RootState } from "../../scripts/redux/reduxStore";
import { palette, themedStyles } from "../misc/theme";

/** Buildings / Upgrades switch at the top of the Shop */
export default function TopTabBar({ state, descriptors, navigateToTab }: MaterialTopTabBarProps) {
    const dispatch = useDispatch();
    // Affordable upgrades the player hasn't seen on the Upgrades tab yet
    const newAffordableUpgrades = useSelector(selectNewAffordableUpgrades);
    const upgradesOpen = state.routes[state.index]?.name === "upgrades";

    // While the Upgrades tab is open, whatever is affordable counts as seen
    useEffect(() => {
        if (upgradesOpen && newAffordableUpgrades > 0) dispatch(markAffordableUpgradesSeen());
    }, [upgradesOpen, newAffordableUpgrades]);

    const segments = state.routes.map((route) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title ?? route.name;
        return {
            label,
            badge: route.name === "upgrades" ? newAffordableUpgrades : undefined,
            onPress: () => navigateToTab(route.key),
        };
    });

    return (
        <View style={styles.container}>
            <SegmentedControl segments={segments} activeIndex={state.index} />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        paddingTop: 12,
        paddingHorizontal: 20,
        backgroundColor: palette.grape,
    },
}));
