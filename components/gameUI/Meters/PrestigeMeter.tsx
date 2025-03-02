import ProgressMeter from "./ProgressMeter";
import Modal from "../../generalUI/Modal";
import ContentBox from "../../generalUI/ContentBox";
import Text from "../../generalUI/Text";
import { colors } from "../../misc/Colors";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../../../scripts/redux/reduxStore";
import { StyleSheet } from "react-native";
import Emoji from "../Emoji";

export default function PrestigeMeter() {
    const { remainingEmojisPrestigePerc, emojiEssence } = useSelector((state: RootState) => state.prestige);

    const [modalVisible, setModalVisible] = useState(false);
    return null
    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.iconContainer}>
                    <View style={styles.innerButtonContainer}>
                        <Emoji size={24} icon="✨" />
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                modalVisible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ContentBox title="Prestige">
                    <View style={styles.prestigeInfoContainer}>
                        <View style={styles.prestigeInfoText}>
                            {/* Add animation where the emoji icon stays the same icon for a few seconds, then skips through a bunch of icons until become another one for a while, to show it changing its shape */}
                            <Text style={styles.paragraph} color={"gray"} size={14} shadow={false}>
                                After having created <Text color={colors.purple.dark} size={14}>10 billion</Text> emojis, the very essence of emojis has started accumulating around you.
                            </Text>

                            <Text style={styles.paragraph} color={"gray"} size={14} shadow={false}>
                                Emoji essence is a <Text color={colors.purple.dark} size={14}>magical substance</Text> that changes its shape whenever you look at it, and holds unknown powers.
                            </Text>
                        </View>
                        <View style={styles.prestigeInfoIcon}>
                            <Emoji icon="✨" />
                        </View>
                    </View>
                </ContentBox>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    prestigeInfoContainer: {
        flexDirection: "row",

    },

    prestigeInfoText: {
        flex: 3,
    },

    prestigeInfoIcon: {
        flex: 1
    },

    paragraph: {
        marginBottom: 10,
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
        zIndex: 2,
    },


})