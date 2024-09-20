import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";

export default function StatsList() {
    const { bigEmojiTaps, emojisEarnedFromTap, effectEmojisCollected } = useSelector((state: RootState) => state.stats);
    return (
        <View style={styles.container}>
            <View style={styles.statContainer}>
                <Text>Emoji taps</Text>
                <Text>{bigEmojiTaps}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>Emojis earned from tapping</Text>
                <Text>{emojisEarnedFromTap}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>Magical emojis tapped</Text>
                <Text>{effectEmojisCollected}</Text>
            </View>
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