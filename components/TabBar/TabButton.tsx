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
}

const width = 74;
const borderWidth = 2.5;
const shadowWidth = width + borderWidth * 2;

const innerButtonHeight = 68;
const backgroundHeight = innerButtonHeight + 12;

const borderRadius = 15;

export default function TabButton(props: TabButtonProps) {
    const { label, labelColor, background, highlight, onPress, icon } = props;
    return (
        <TouchableOpacity onPress={onPress}>
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: borderWidth,
        borderColor: componentColors.tabBar.border,
        overflow: "hidden",
        height: backgroundHeight,
        borderRadius: borderRadius
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
    }
})