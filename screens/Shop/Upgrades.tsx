import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import UpgradesList from "../../components/gameUI/UpgradesList";

export default function Upgrades() {
    return (
        <View style={{ width: "100%" }}>
            <ScrollToTopView scrollToTopThreshold={Infinity}>
                <UpgradesList />
            </ScrollToTopView>
        </View>
    )
}