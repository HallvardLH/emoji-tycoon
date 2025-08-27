import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, StyleProp, ViewStyle } from "react-native";
import { componentColors, colors } from "../misc/Colors";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

interface TopTabBarProps extends MaterialTopTabBarProps {
    contentSpacing?: number;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function TopTabBar({ state, descriptors, navigation, contentSpacing = 10, containerStyle }: TopTabBarProps) {
    const [activeTab, setActiveTab] = useState(state.index);

    // Update activeTab whenever state.index changes
    useEffect(() => {
        setActiveTab(state.index);
    }, [state.index]);

    // Extract tab data
    const tabs = state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;

        return {
            key: route.key,
            name: label,
            onNavigateTo: () => navigation.navigate(route.name),
            notification: options.tabBarBadge, // if you want badges
        };
    });

    // Calculate width in percentage based on the number of tabs
    const tabWidthPercent = 100 / tabs.length;

    // Initialize position with active tab
    const position = useRef(new Animated.Value(activeTab * tabWidthPercent)).current;

    useEffect(() => {
        Animated.spring(position, {
            toValue: activeTab * tabWidthPercent,
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    const animatedStyle = {
        left: position.interpolate({
            inputRange: tabs.map((_, i) => tabWidthPercent * i),
            outputRange: tabs.map((_, i) =>
                (tabWidthPercent * i + (i == 0 ? -0.5 : 0) + (i == tabs.length - 1 ? 0.5 : 0)) + "%"
            ),
        }),
    };

    return (
        <View style={[styles.container, { paddingBottom: contentSpacing }]}>
            <Shadow style={{ alignSelf: "center" }} height={buttonContainerHeight} shadowHeight={5} width={"88%"} borderRadius={50} />
            <View style={styles.buttonContainer}>
                <Animated.View style={[styles.focusedContainer, animatedStyle, { width: `${tabWidthPercent}%` }]} />
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tabButton, { width: `${tabWidthPercent}%` }]}
                        onPress={() => tab.onNavigateTo()}
                    >
                        <Text>{tab.name}</Text>
                        {tab.notification ? (
                            <View>
                                <Text size={12}>{tab.notification}</Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const buttonHeight = 46;
const buttonContainerHeight = buttonHeight + 4

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: 'relative',
        backgroundColor: "#7054FE"
        // flex: 1,
    },
    tabContent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },

    focusedContainer: {
        position: "absolute",
        borderColor: componentColors.contentTab.border,
        borderWidth: 2,
        backgroundColor: componentColors.contentTab.focused,
        borderRadius: 50,
        height: buttonContainerHeight,
    },

    tabButton: {
        backgroundColor: "transparent",
        borderRadius: 50,
        borderColor: componentColors.contentTab.border,
        height: buttonHeight,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },

    buttonContainer: {
        flexDirection: "row",
        width: "88%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
        height: buttonContainerHeight,
        backgroundColor: componentColors.contentTab.background,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: componentColors.contentTab.border,
        overflow: "hidden",
    },

    child: {
        justifyContent: "flex-start",
        // alignItems: "center",
        flex: 1,
        marginBottom: 50,
    }
});
