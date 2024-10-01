import { View, StyleSheet } from "react-native";
import Emoji from "../Emoji";
import { colors } from "../../misc/Colors";
import { ViewStyle } from "react-native";

interface ProgressMeterProps {
    percentage: number;
    barTopColor?: string;
    barBottomColor?: string;
    icon: string;
    side?: "left" | "right";
}

export default function ProgressMeter(props: ProgressMeterProps) {
    const { percentage, barTopColor = colors.blue.light, barBottomColor = colors.blue.dark, icon, side = "left" } = props;

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
                <View style={[styles.progressBarFill, { width: percentage + "%" } as ViewStyle]}>
                    <View style={[
                        styles.fillTop, { backgroundColor: barTopColor }
                    ]} />
                    <View style={[styles.fillBottom, { backgroundColor: barBottomColor }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center", // Align items along the cross axis
    },
    progressBarContainer: {
        height: 28,
        width: 100, // Control width here
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
    },
});
