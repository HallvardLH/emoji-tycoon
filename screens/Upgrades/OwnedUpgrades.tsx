import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import OwnedUpgradesList from "../../components/gameUI/Upgrades/OwnedUpgradesList";

export default function OwnedUpgrades() {
    return (
        <View style={{ width: "100%" }}>
            {/* <ScrollToTopView scrollToTopThreshold={Infinity}> */}
            <OwnedUpgradesList />
            {/* </ScrollToTopView> */}
        </View>
    )
}