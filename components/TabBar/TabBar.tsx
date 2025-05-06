import React, { useState, useEffect, act } from 'react';
import { View, StyleSheet, Keyboard, Platform } from "react-native";
import TabButton from "./TabButton";
import { componentColors, colors } from "../misc/Colors";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import store from '../../scripts/redux/reduxStore';
import { clearUnlockedUpgradeNotifications } from '../../scripts/redux/upgradesSlice';
import { clearUnlockedBuildingsNotifications } from '../../scripts/redux/buildingsSlice';
import { canBuyBuilding } from '../../scripts/game/buildings/checks';
import { canBuyUpgrade } from '../../scripts/game/upgrades/checks';
import { setActiveTab } from '../../scripts/redux/tabsSlice';

interface TabBarProps {
    height?: number;
}

export default function TabBar(props: TabBarProps) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { height = 100 } = props;

    const { unlockedUpgradeNotification } = useSelector((state: RootState) => state.upgrades);
    const { unlockedBuildingsNotification } = useSelector((state: RootState) => state.buildings);

    const { activeTab } = useSelector((state: RootState) => state.tabs);

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
                onPress={() => {
                    navigation.navigate("Emoji");
                    store.dispatch(setActiveTab("emoji"));
                }}
                label="Emoji"
                icon="😀"
                background={componentColors.tabBar.home.background}
                highlight={componentColors.tabBar.home.highlight}
                notifications={0}
                active={activeTab === "emoji"}
            />
            <TabButton
                onPress={() => {
                    navigation.navigate("Buildings");
                    store.dispatch(clearUnlockedBuildingsNotifications());
                    canBuyBuilding();
                    store.dispatch(setActiveTab("buildings"));
                }}
                label="Buildings"
                icon="🏛️"
                background={colors.yellow.medium}
                highlight={colors.yellow.highlight}
                notifications={unlockedBuildingsNotification}
                active={activeTab === "buildings"}
            />
            <TabButton
                onPress={() => {
                    navigation.navigate("Upgrades");
                    store.dispatch(clearUnlockedUpgradeNotifications());
                    canBuyUpgrade();
                    store.dispatch(setActiveTab("upgrades"));
                }}
                label="Upgrades"
                icon="💡"
                background={componentColors.tabBar.browse.background}
                highlight={componentColors.tabBar.browse.highlight}
                notifications={unlockedUpgradeNotification}
                active={activeTab === "upgrades"}
            />
            <TabButton
                onPress={() => {
                    navigation.navigate("Emojidex");
                    store.dispatch(setActiveTab("emojidex"));
                }
                }
                label="Emojidex"
                icon="📖"
                background={componentColors.tabBar.daily.background}
                highlight={componentColors.tabBar.daily.highlight}
                notifications={0}
                active={activeTab === "emojidex"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === "ios" ? 50 : 0,
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