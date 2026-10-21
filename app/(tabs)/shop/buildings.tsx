import { ScrollView, View, StyleSheet } from "react-native";
import BuildingsList from "../../../components/gameUI/Buildings/BuildingsList";
import ScreenView from "../../../components/layout/ScreenView";
import BulkBuySlider from "../../../components/gameUI/BulkBuySlider";

export default function BuildingsTab() {
    return (
        <ScreenView scrollView={false} style={styles.screen}>
            <View style={styles.bulk}>
                <BulkBuySlider />
            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <BuildingsList />
            </ScrollView>
        </ScreenView>
    )
}

const styles = StyleSheet.create({
    screen: {
        alignItems: "stretch",
        justifyContent: "flex-start",
        gap: 0,
    },
    bulk: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 14,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
})
