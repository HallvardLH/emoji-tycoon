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
import { Trans, useTranslation } from "react-i18next";
import { formatNumber } from "../../../scripts/misc";

export default function PrestigeMeter() {
    const { remainingEmojisPrestigePerc, emojiEssence } = useSelector((state: RootState) => state.prestige);

    const [modalVisible, setModalVisible] = useState(false);
    const { t } = useTranslation();
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
                <ContentBox title={t("prestige.title")}>
                    <View style={styles.prestigeInfoContainer}>
                        <View style={styles.prestigeInfoText}>
                            {/* Add animation where the emoji icon stays the same icon for a few seconds, then skips through a bunch of icons until become another one for a while, to show it changing its shape */}
                            <Text style={styles.paragraph} color={"gray"} size={14} shadow={false}>
                                <Trans i18nKey="prestige.accumulating" values={{ amount: formatNumber(10000000000) }} components={{ hl: <Text color={colors.purple.dark} size={14} /> }} />
                            </Text>

                            <Text style={styles.paragraph} color={"gray"} size={14} shadow={false}>
                                <Trans i18nKey="prestige.essence" components={{ hl: <Text color={colors.purple.dark} size={14} /> }} />
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