import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { colors } from "../misc/Colors";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import { useDispatch } from 'react-redux';
import { updateBulkBuy } from "../../scripts/redux/preferencesSlice";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';

interface BulkBuySliderProps {
    contentSpacing?: number;
}

export default function BulkBuySlider(props: BulkBuySliderProps) {
    const { contentSpacing = 25, } = props;
    const { bulkBuy } = useSelector((state: RootState) => state.preferences);

    // Translating bulkBuy values to indices
    let currentIndex = 0;
    if (bulkBuy == 1) {
        currentIndex = 0;
    } else if (bulkBuy == 10) {
        currentIndex = 1;
    } else if (bulkBuy == 100) {
        currentIndex = 2;
    }
    const [activeTab, setActiveTab] = useState(currentIndex);

    const dispatch = useDispatch();

    const switchMode = (mode: 1 | 10 | 100) => {
        dispatch(updateBulkBuy(mode));
    };

    // tabs: Array<{
    //     name: string;
    //     onNavigateTo?: () => void;
    // }>;

    const tabs = [
        {
            name: 1,
            onPress: () => {
                switchMode(1);
            }
        },
        {
            name: 10,
            onPress: () => {
                switchMode(10);
            },
        },
        {
            name: 100,
            onPress: () => {
                switchMode(100);
            },
        },
    ]

    // Calculate width in percentage based on the number of tabs
    const tabWidthPercent = 100 / tabs.length;

    // Initialize the position with the activeTab
    // Convert activeTab index to a percentage
    const initialPosition = activeTab * tabWidthPercent;
    const position = useRef(new Animated.Value(initialPosition)).current;

    useEffect(() => {
        // Calculate the new position based on the activeTab
        const newPosition = activeTab * tabWidthPercent;

        Animated.spring(position, {
            toValue: newPosition,
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    const animatedStyle = {
        left: position.interpolate({
            inputRange: tabs.map((_, index) => (100 / (tabs.length)) * index),
            outputRange: tabs.map((_, index) => (
                // For last and first, push the element slightly further to the right or left
                // In order to avoid ugly doubling of borders
                (tabWidthPercent * index + (index == 0 ? -0.5 : 0) + (index == tabs.length - 1 ? 0.5 : 0)) + "%"
            )),
        })
    };

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%"
        }}>
            <Text size={14}>Buying {bulkBuy} building{bulkBuy == 1 ? null : "s"} at a time</Text>
            <View style={styles.container}>
                <Shadow style={{ alignSelf: "center" }} height={buttonContainerHeight} shadowHeight={5} width={"88%"} borderRadius={50} />
                <View style={styles.buttonContainer}>
                    <Animated.View style={[styles.focusedContainer, animatedStyle, { width: `${tabWidthPercent}%` }]} />
                    {tabs.map((tab, index) =>
                        <TouchableOpacity
                            style={[styles.tabButton, { width: `${tabWidthPercent}%` }]}
                            key={"TabButton-" + index}
                            onPress={() => {
                                setActiveTab(index);
                                tab.onPress();
                            }}
                        >
                            <Text size={16}>{tab.name}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {tabs.map((tab, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            {
                                opacity: activeTab === index ? 1 : 0,
                                top: 50 + contentSpacing,
                                // Ensure only the active tab is interactable
                                zIndex: activeTab === index ? 1 : 0,
                            },
                        ]}
                    />
                ))}

            </View>
        </View>
    );
}

const buttonHeight = 30;
const buttonContainerHeight = buttonHeight + 4

const styles = StyleSheet.create({
    container: {
        width: "36%",
        position: 'relative',
        alignSelf: "flex-end",
        marginRight: 12,
    },

    focusedContainer: {
        position: "absolute",
        borderColor: colors.border,
        borderWidth: 2,
        backgroundColor: colors.blue.dark,
        borderRadius: 50,
        height: buttonContainerHeight,
    },

    tabButton: {
        backgroundColor: "transparent",
        borderRadius: 50,
        borderColor: colors.border,
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
        backgroundColor: colors.blue.medium,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.border,
        overflow: "hidden",
    },
});