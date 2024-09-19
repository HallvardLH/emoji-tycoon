import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import UpgradesList from "../../components/gameUI/Upgrades/UpgradesList";
import UpgradesListFilter from "../../components/gameUI/Upgrades/UpgradesListFilter";

export default function BuyUpgrades() {
    return (
        <View style={{ width: "100%" }}>
            <UpgradesListFilter />
            {/* <ScrollToTopView scrollToTopThreshold={Infinity}> */}
            <UpgradesList />
            {/* </ScrollToTopView> */}
        </View>
    )
}