import ScrollToTopView from "../../../components/layout/ScrollToTopView";
import { View } from "react-native";
import BuildingsList from "../../../components/gameUI/Buildings/BuildingsList";
import ScreenView from "../../../components/layout/ScreenView";
import BulkBuySlider from "../../../components/gameUI/BulkBuySlider";

export default function BuildingsTab() {
    return (
        <ScreenView>
            <BulkBuySlider />
            <View style={{
                flex: 1,
                width: "100%"
            }}>
                <ScrollToTopView scrollToTopThreshold={Infinity}>
                    <BuildingsList />
                </ScrollToTopView>
            </View>
        </ScreenView>
    )
}