import { View, TouchableOpacity, StyleSheet, Image, Text as RNText } from "react-native";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import { componentColors } from "../misc/Colors";

interface TabButtonProps {
    label: string;
    background: string;
    highlight: string;
    onPress?: () => void;
    icon: string;
}

const width = 70;
const borderWidth = 3;
const shadowWidth = width + borderWidth * 2;

const innerButtonHeight = 64;
const backgroundHeight = innerButtonHeight + 12;

const borderRadius = 15;

export default function TabButton(props: TabButtonProps) {
    const { label, background, highlight, onPress, icon } = props;
    return (
        <TouchableOpacity onPress={onPress}>
            <Shadow width={shadowWidth} height={backgroundHeight} shadowHeight={4} borderRadius={borderRadius} />
            <View style={styles.container}>
                <View style={[styles.background, { backgroundColor: highlight }]} />
                <View style={[styles.outerButtonContainer, { backgroundColor: background }]}>
                    <View style={styles.innerButtonContainer}>
                        <RNText style={{ fontSize: 26 }}>{icon}</RNText>
                        <Text size={14} style={{ textAlign: "center" }}>{label}</Text>
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
        marginTop: 4,
        alignItems: "center",
        justifyContent: "center",
    },

    icon: {
        height: 26,
        width: 26,
    }
})