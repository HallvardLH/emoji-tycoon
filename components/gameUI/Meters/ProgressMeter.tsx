import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Emoji from "../Emoji";
import { colors } from "../../misc/Colors";
import { ViewStyle } from "react-native";
import Text from "../../generalUI/Text";

interface ProgressMeterProps {
    percentage: number | string;
    barTopColor?: string;
    barBottomColor?: string;
    icon: string;
    side?: "left" | "right";
    label?: string;
}

export default function ProgressMeter(props: ProgressMeterProps) {
    const { percentage, barTopColor = colors.blue.light, barBottomColor = colors.blue.dark, icon, side = "left", label } = props;

    // Create animated value for the width
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate the width when the percentage changes
        Animated.timing(animatedWidth, {
            toValue: typeof percentage === "number" ? percentage : parseInt(percentage, 10),
            duration: 1000,
            useNativeDriver: false, // Since we are animating width, set useNativeDriver to false
        }).start();
    }, [percentage]);

    return (
        <View style={[
            styles.container,
            { flexDirection: side == "left" ? "row" : "row-reverse" }
        ]}>
            <View style={styles.iconContainer}>
                <View style={styles.innerButtonContainer}>
                    <Emoji size={24} icon={icon} />
                </View>

            </View>
            <View style={[
                styles.progressBarContainer,
                side == "left" ? { marginLeft: -6 } : { marginRight: -6 },
                side == "left" ? { borderTopRightRadius: 7, borderBottomRightRadius: 7 } : { borderTopLeftRadius: 7, borderBottomLeftRadius: 7 },
            ]}>
                <Animated.View style={[styles.progressBarFill, {
                    width: animatedWidth.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%']
                    })
                } as ViewStyle]}>
                    <View style={[
                        styles.fillTop, { backgroundColor: barTopColor }
                    ]} />
                    <View style={[styles.fillBottom, { backgroundColor: barBottomColor }]} />
                </Animated.View>
                <View style={[styles.label, side === "left" ? styles.labelLeft : styles.labelRight]}><Text style={{ textAlign: "center" }} size={14}>{label}</Text></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    progressBarContainer: {
        height: 28,
        width: 120,
        backgroundColor: "transparent",
        borderWidth: 2.5,
        borderColor: colors.border,
    },
    progressBarFill: {
        height: "100%",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    fillTop: {
        width: "100%",
        height: "80%",
        borderTopRightRadius: 2,
    },
    fillBottom: {
        width: "100%",
        height: "20%",
        borderBottomRightRadius: 2,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        zIndex: 2,
    },
    innerButtonContainer: {
        borderColor: colors.border,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue.medium,
        width: 40,
        height: 40,
        borderWidth: 2.5,
        zIndex: 2,
    },

    label: {
        top: 2.5,
        paddingTop: .8,
        backgroundColor: colors.blue.dark,
        width: 120,
        height: 23,
        zIndex: 0,
        borderLeftWidth: 2.5,
        borderRightWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: colors.border,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },

    labelRight: {
        left: 20,
        paddingLeft: 0,
        paddingRight: 4,
    },

    labelLeft: {
        right: 20,
        paddingLeft: 4,
        paddingRight: 0,
    },


});
