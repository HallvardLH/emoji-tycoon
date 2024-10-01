import { View, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../scripts/redux/reduxStore";
import ProgressMeter from "./ProgressMeter";
// import { Effect } from "../../scripts/redux/bigEmojiSlice";

export default function EffectMeters() {
    const { effects } = useSelector((state: RootState) => state.effects);
    return (
        <View style={styles.container}>
            <ScrollView persistentScrollbar={true} contentContainerStyle={styles.innerContainer}>
                {effects.map((effect) => (
                    // TODO: Based on the id, instead of creating duplicates, add multiplier sign
                    // Also add label to meter component, to allow for a title that explains the effect better
                    <ProgressMeter
                        key={effect.instanceId}
                        icon={effect.emoji}
                        percentage={effect.timeLeft / effect.originalDuration! * 100}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 160,
        gap: 10,
    },

    innerContainer: {
        gap: 10,
        width: "100%",
        paddingRight: 10,
    },
})