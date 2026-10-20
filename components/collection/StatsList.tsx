import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";
import { useTranslation } from "react-i18next";

export default function StatsList() {
    const { t } = useTranslation();
    const { bigEmojiTaps, emojisEarnedFromTap, effectEmojisCollected, emojisGained } = useSelector((state: RootState) => state.stats);
    const { funValue } = useSelector((state: RootState) => state.values);
    return (
        <View style={styles.container}>
            <View style={styles.statContainer}>
                <Text>{t("stats.totalEmojisDrawn")}</Text>
                <Text>{formatNumber(emojisGained, 0)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>{t("stats.emojiTaps")}</Text>
                <Text>{formatNumber(bigEmojiTaps)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>{t("stats.emojisEarnedFromTapping")}</Text>
                <Text>{formatNumber(emojisEarnedFromTap)}</Text>
            </View>
            <View style={styles.statContainer}>
                <Text>{t("stats.magicalEmojisTapped")}</Text>
                <Text>{formatNumber(effectEmojisCollected)}</Text>
            </View>
            {funValue == 100 && (
                <View style={styles.statContainer}>
                    <Text>{t("stats.funValue")}</Text>
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