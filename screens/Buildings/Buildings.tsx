import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import BuildingsList from "../../components/gameUI/Buildings/BuildingsList";
import ScreenView from "../../components/layout/ScreenView";

export default function Buildings() {
    return (
        <ScreenView>
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