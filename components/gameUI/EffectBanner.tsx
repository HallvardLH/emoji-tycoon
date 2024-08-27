import { View, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Text from "../generalUI/Text";
import Emoji from "./Emoji";
import Shadow from "../misc/Shadow";
// import { Effect } from "../../scripts/redux/bigEmojiSlice";

export default function EffectBanner() {
    const { effects } = useSelector((state: RootState) => state.effects);
    return (
        <View style={styles.container}>
            <ScrollView persistentScrollbar={true} contentContainerStyle={styles.innerContainer}>
                <View style={{ alignItems: "center" }}>
                    {effects.map((effect) => (
                        <View key={effect.id} style={styles.bannerOuterContainer}>
                            <Shadow borderRadius={10} shadowHeight={18} height={50} width={"100%"} />
                            <View style={styles.bannerContainer}>
                                <Emoji icon={effect.emoji} size={30} />
                                <View>
                                    <Text>{effect.title}</Text>
                                    <Text>{effect.timeLeft}</Text>
                                    <Text size={14}>{effect.description}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        width: "90%",
        height: 140,
        position: "absolute",
        top: 0,
        // alignItems: "center",
        gap: 10,
    },

    innerContainer: {
        // height: 100,
        // width: "100%",
        gap: 10,
        paddingTop: 10,
        alignItems: "center"
    },

    bannerOuterContainer: {
        width: "90%",
        alignItems: "center",
    },

    bannerContainer: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "rgba(159, 81, 254, 1)",
        width: "90%",
        height: 65,
        // borderColor: "white",
        // borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    }
})