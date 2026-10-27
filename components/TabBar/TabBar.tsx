import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabButton from "./TabButton";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../../scripts/redux/tabsSlice";
import { palette, themedStyles } from "../misc/theme";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import store from '../../scripts/redux/reduxStore';
import { canBuyBuilding } from "../../scripts/game/buildings/checks";
import { canBuyUpgrade } from "../../scripts/game/upgrades/checks";
import { clearUnlockedBuildingsNotifications } from "../../scripts/redux/buildingsSlice";
import { selectNewAffordableUpgrades } from "../../scripts/redux/upgradesSlice";
import * as Haptics from "../../scripts/game/haptics";
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

    // A highlight slides behind the active tab, with a lamp on the bar's top edge above it
    const routes = state.routes.filter(route => tabData.hasOwnProperty(route.name));
    const activeIndex = routes.findIndex(route => route.key === state.routes[state.index].key);
    const [rowWidth, setRowWidth] = useState(0);
    const tabWidth = routes.length > 0 ? rowWidth / routes.length : 0;
    const slide = useRef(new Animated.Value(activeIndex)).current;

    useEffect(() => {
        Animated.spring(slide, { toValue: activeIndex, friction: 9, tension: 110, useNativeDriver: true }).start();
    }, [activeIndex]);

    const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [0, tabWidth || 1] });

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            {tabWidth > 0 && activeIndex >= 0 && (
                <>
                    <Animated.View pointerEvents="none" style={[styles.highlight, { width: tabWidth - HIGHLIGHT_INSET * 2, transform: [{ translateX }] }]} />
                    <Animated.View pointerEvents="none" style={[styles.lamp, { left: PADDING + (tabWidth - LAMP_WIDTH) / 2, transform: [{ translateX }] }]} />
                </>
            )}
            <View style={styles.row} accessibilityRole="tablist" onLayout={e => setRowWidth(e.nativeEvent.layout.width)}>
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
        </View>
    );
}

const PADDING = 12;
const TOP = 8;
const HIGHLIGHT_INSET = 6;
const LAMP_WIDTH = 32;

const styles = themedStyles(() => StyleSheet.create({
    container: {
        backgroundColor: palette.night,
        borderTopWidth: 1,
        borderTopColor: palette.glassSoft,
        paddingTop: TOP,
        paddingHorizontal: PADDING,
    },
    row: {
        flexDirection: "row",
    },
    highlight: {
        position: "absolute",
        top: TOP,
        left: PADDING + HIGHLIGHT_INSET,
        height: 62,
        borderRadius: 20,
        backgroundColor: palette.glass,
        borderWidth: 1,
        borderColor: palette.glassLine,
    },
    lamp: {
        position: "absolute",
        top: -1,
        width: LAMP_WIDTH,
        height: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: palette.sun,
        shadowColor: palette.sun,
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
}));
