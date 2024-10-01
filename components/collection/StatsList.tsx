import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";

export default function StatsList() {
    const { bigEmojiTaps, emojisEarnedFromTap, effectEmojisCollected, emojisGained } = useSelector((state: RootState) => state.stats);
    const { funValue } = useSelector((state: RootState) => state.values);
    return (
        <View style={styles.container}>
            <View style={styles.statContainer}>
                <Text>Total emojis drawn</Text>
                <Text>{formatNumber(emojisGained, 0)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>Emoji taps</Text>
                <Text>{formatNumber(bigEmojiTaps)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>Emojis earned from tapping</Text>
                <Text>{formatNumber(emojisEarnedFromTap)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>Magical emojis tapped</Text>
                <Text>{formatNumber(effectEmojisCollected)}</Text>
            </View>
            {funValue == 100 && (
                <View style={styles.statContainer}>
                    <Text>Fun value</Text>
                    <Text>{formatNumber(funValue)}😭</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 26,
        gap: 10,
    },
    statContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})