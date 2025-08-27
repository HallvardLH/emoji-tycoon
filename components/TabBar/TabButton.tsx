import { View, Pressable, StyleSheet, Image, Text as RNText } from "react-native";
import Text from "../generalUI/Text";
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

export default function TabButton({ label, labelColor, background, highlight, onPress, icon, notifications, active }: TabButtonProps) {
    return (
        <Pressable hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} style={[!active ? styles.inactive : null, styles.container]} onPress={onPress}>
            <Emoji opacity={active ? 1 : 1} icon={icon}></Emoji>
            {(typeof notifications === 'number' && notifications > 0) && (
                <View style={styles.notificationContainer}>
                    <View style={[styles.notification3DEffect, { width: notifications < 100 ? 26 : 34 }]} />
                    <View style={[styles.notification, { width: notifications < 100 ? 26 : 34 }]}>
                        <Text style={{ position: "absolute" }} size={13}>{notifications < 100 ? notifications : "+99"}</Text>
                    </View>
                </View>
            )}

            {active && (
                <View style={styles.activeDot} />
            )}
            <Text>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 2,
    },
    activeDot: {
        height: 6,
        width: 6,
        borderRadius: "100%",
        backgroundColor: "#a458db"
    },
    inactive: {
        top: 8,
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