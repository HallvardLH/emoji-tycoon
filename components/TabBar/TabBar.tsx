import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabButton from "./TabButton";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../scripts/redux/tabsSlice";
import { palette } from "../misc/theme";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import store from '../../scripts/redux/reduxStore';
import { canBuyBuilding } from "../../scripts/game/buildings/checks";
import { canBuyUpgrade } from "../../scripts/game/upgrades/checks";
import { clearUnlockedBuildingsNotifications } from "../../scripts/redux/buildingsSlice";
import { selectNewAffordableUpgrades } from "../../scripts/redux/upgradesSlice";
import * as Haptics from 'expo-haptics';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tab } from "../../scripts/redux/tabsSlice";

type TabData = {
    title: string;
    icon: string;
};

const tabData: Record<string, TabData> = {
    index: {
        title: "Emoji",
        icon: "😀",
    },
    shop: {
        title: "Shop",
        icon: "🛒",
    },
    emojidex: {
        title: "Emojidex",
        icon: "📖",
    },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    // Buildings unlocked since the Shop was last opened, plus the Upgrades tab's own badge,
    // so the Shop badge always adds up to what's waiting inside it
    const newAffordableUpgrades = useSelector(selectNewAffordableUpgrades);
    const unlockedBuildingsNotification = useSelector((state: RootState) => state.buildings.unlockedBuildingsNotification);

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 14) }]} accessibilityRole="tablist">
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                if (!tabData.hasOwnProperty(route.name)) return
                const { title, icon } = tabData[route.name];

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
                            canBuyUpgrade();
                        }
                    }

                };

                let notificationCount = 0;
                if (title === "Shop") {
                    notificationCount = newAffordableUpgrades + unlockedBuildingsNotification;
                }

                return (
                    <TabButton
                        key={route.key}
                        onPress={onPress}
                        label={title}
                        icon={icon}
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
        backgroundColor: palette.night,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        paddingTop: 10,
        paddingHorizontal: 20,
    },
});
