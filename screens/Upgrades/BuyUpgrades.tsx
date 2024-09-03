import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import UpgradesList from "../../components/gameUI/Upgrades/UpgradesList";

export default function BuyUpgrades() {
    return (
        <View style={{ width: "100%" }}>
            <ScrollToTopView scrollToTopThreshold={Infinity}>
                <UpgradesList />
            </ScrollToTopView>
        </View>
    )
}