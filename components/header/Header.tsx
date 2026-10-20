import { StyleSheet, Platform, TouchableOpacity, View } from "react-native";
import Text from "../generalUI/Text";
import EmojisAmount from "../gameUI/EmojisAmount";
import EpsAmount from "../gameUI/EpsAmount";
import { SafeAreaView } from "react-native-safe-area-context";
import { componentColors } from "../misc/Colors";
import HomeNavigation from "../drawer/HomeNavigation";
import { useTranslation } from "react-i18next";

type HeaderProps = {
    navigation: any;
    route: { name: string };
    options: { title?: string };
    back?: { title?: string; href?: string };
};

export default function Header({ navigation, route, options, back }: HeaderProps) {
    const { t } = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cornerSection}>
                {back ? (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={styles.textContainer}>
                <Text
                    style={{ fontSize: Platform.OS === "ios" ? 18 : 15 }}
                    // Long number names, like "quattuordecillion", shrink instead of pushing the buttons aside
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}>
                    <EmojisAmount fontSize={Platform.OS === "ios" ? 27 : 23} /> {t("header.emojis")}
                </Text>
                <EpsAmount fontSize={Platform.OS === "ios" ? 18 : 15} />
            </View>
            <View style={styles.cornerSection}>
                {/* {route.name == "Emoji" ? ( */}
                <HomeNavigation />
                {/* ) : (
                    <CircularButton variant="back" onPress={onPress} />
                )} */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingHorizontal: 10,
        height: Platform.OS === "ios" ? 125 : 100,
        backgroundColor: componentColors.mainBg.end,
    },
    backButton: {
        marginRight: 16,
    },
    backText: {
        color: 'white',
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        textAlign: "center"
    },
    cornerSection: {
        maxWidth: 50,
        minWidth: 50,
        alignItems: "center"
    }
})