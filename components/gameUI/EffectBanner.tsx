import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import Emoji from "./Emoji";
import Shadow from "../misc/Shadow";

export default function EffectBanner() {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Shadow borderRadius={10} shadowHeight={18} height={50} width={"80%"} />
                <View style={styles.bannerContainer}>
                    <Emoji icon="😍" size={30} />
                    <View>
                        <Text>You found 😍!</Text>
                        <Text size={14}>Double emojis per tap for 10 seconds!</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        width: "100%",
        height: 50,
        position: "absolute",
        top: 10,
        alignItems: "center",
        gap: 10,
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
    }
})