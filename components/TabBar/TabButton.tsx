import { View, TouchableOpacity, StyleSheet, Image, Text as RNText } from "react-native";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import { componentColors } from "../misc/Colors";
import Emoji from "../gameUI/Emoji";

interface TabButtonProps {
    label: string;
    labelColor?: string;
    background: string;
    highlight: string;
    onPress?: () => void;
    icon: string;
    notifications?: number;
    active?: boolean;
}

// These values are defined once here to avoid magic numbers in the code
// and to make it easier to change them in the future.
const width = 74;
const borderWidth = 2.5;
const shadowWidth = width + borderWidth * 2;

const innerButtonHeight = 68;
const backgroundHeight = innerButtonHeight + 12;

const borderRadius = 15;

export default function TabButton(props: TabButtonProps) {
    const { label, labelColor, background, highlight, onPress, icon, notifications, active } = props;

    return (
        <TouchableOpacity style={[active ? { top: -5, transform: [{ scale: 1.1 }] } : null]} onPress={onPress}>

            <Shadow width={shadowWidth} height={backgroundHeight} shadowHeight={4} borderRadius={borderRadius} />
            <View style={styles.container}>
                <View style={[styles.background, { backgroundColor: highlight }]} />
                <View style={[styles.outerButtonContainer, { backgroundColor: background }]}>
                    <View style={styles.innerButtonContainer}>
                        <Emoji size={32} icon={icon} />
                        <Text size={14} color={labelColor} style={{ textAlign: "center" }}>{label}</Text>
                    </View>
                </View>
            </View>
            {(typeof notifications === 'number' && notifications > 0) && (
                <View style={styles.notificationContainer}>
                    <View style={[styles.notification3DEffect, { width: notifications < 100 ? 26 : 34 }]} />
                    <View style={[styles.notification, { width: notifications < 100 ? 26 : 34 }]}>
                        <Text style={{ position: "absolute" }} size={13}>{notifications < 100 ? notifications : "+99"}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: borderWidth,
        borderColor: componentColors.tabBar.border,
        overflow: "hidden",
        height: backgroundHeight,
        borderRadius: borderRadius,
    },

    background: {
        width: width,
        height: backgroundHeight,
        position: "absolute",
    },

    outerButtonContainer: {
        height: innerButtonHeight,
        width: width,
        borderBottomRightRadius: borderRadius - 2,
        borderBottomLeftRadius: borderRadius - 2,
    },

    innerButtonContainer: {
        height: innerButtonHeight,
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center",
    },

    icon: {
        height: 26,
        width: 26,
    },

    notificationContainer: {
        position: "absolute",
        top: -8,
        right: -10,
    },

    notification: {

        padding: 4,
        height: 26,
        width: 26,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        backgroundColor: "#FF335F",
    },

    notification3DEffect: {
        position: "absolute",
        backgroundColor: "#D40633",
        top: 1.3,
        height: 26,
        width: 26,
        borderRadius: 100,
    }
})


