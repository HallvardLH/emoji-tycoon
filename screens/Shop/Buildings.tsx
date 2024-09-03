import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import BuildingsList from "../../components/gameUI/Buildings/BuildingsList";

export default function Buildings() {
    return (
        <View style={{ width: "100%" }}>
            <ScrollToTopView scrollToTopThreshold={Infinity}>
                <BuildingsList />
            </ScrollToTopView>
        </View>
    )
}