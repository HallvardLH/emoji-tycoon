import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabButton from "./TabButton";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../scripts/redux/tabsSlice";
import { componentColors, colors } from "../misc/Colors";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import store from '../../scripts/redux/reduxStore';
import { canBuyBuilding } from "../../scripts/game/buildings/checks";
import { canBuyUpgrade } from "../../scripts/game/upgrades/checks";
import { clearUnlockedBuildingsNotifications } from "../../scripts/redux/buildingsSlice";
import { clearUnlockedUpgradeNotifications } from "../../scripts/redux/upgradesSlice";
import * as Haptics from 'expo-haptics';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tab } from "../../scripts/redux/tabsSlice";

type TabData = {
    title: string;
    icon: string;
    background: string;
    highlight: string;
};

const tabData: Record<string, TabData> = {
    index: {
        title: "Emoji",
        icon: "😀",
        background: componentColors.tabBar.home.background,
        highlight: componentColors.tabBar.home.highlight,
    },
    shop: {
        title: "Shop",
        icon: "🛒",
        background: colors.yellow.medium,
        highlight: colors.yellow.highlight,
    },
    emojidex: {
        title: "Emojidex",
        icon: "📖",
        background: componentColors.tabBar.daily.background,
        highlight: componentColors.tabBar.daily.highlight,
    },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const { unlockedUpgradeNotification } = useSelector((state: RootState) => state.upgrades);
    const { unlockedBuildingsNotification } = useSelector((state: RootState) => state.buildings);

    return (
        <View style={[styles.container, { paddingBottom: Platform.OS === 'android' ? 10 : insets.bottom }]}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                if (!tabData.hasOwnProperty(route.name)) return
                const { title, icon, background, highlight } = tabData[route.name];

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true
                    });

                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                        dispatch(setActiveTab(title as Tab));

                        if (route.name === "shop") {
                            store.dispatch(clearUnlockedBuildingsNotifications());
                            canBuyBuilding();

                            store.dispatch(clearUnlockedUpgradeNotifications());
                            canBuyUpgrade();
                        }
                    }

                };

                let notificationCount = 0;
                if (title === "Shop") {
                    notificationCount = unlockedUpgradeNotification + unlockedBuildingsNotification;
                }

                return (
                    <TabButton
                        key={route.key}
                        onPress={onPress}
                        label={title}
                        icon={icon}
                        background={background}
                        highlight={highlight}
                        notifications={notificationCount}
                        active={isFocused}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5842c4",
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#523fb3",
        paddingTop: Platform.OS === 'android' ? 15 : 5,
    },
});
