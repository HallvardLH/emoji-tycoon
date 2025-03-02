import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import UpgradesList from "../../components/gameUI/Upgrades/UpgradesList";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import UpgradesListFilter from "../../components/gameUI/Upgrades/UpgradesListFilter";
import Text from "../../components/generalUI/Text";

export default function BuyUpgrades() {
    const { upgradeFilter } = useSelector((state: RootState) => state.preferences);
    return (
        <View style={{ width: "100%" }}>
            {/* <ScrollToTopView scrollToTopThreshold={Infinity}> */}
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
                marginTop: 5,
            }}>
                <Text size={20}>Building upgrades</Text>

            </View>
            <View style={{
                position: "absolute",
                right: 20,
            }}>
                <UpgradesListFilter selected={upgradeFilter} />
            </View>
            <UpgradesList />
            {/* </ScrollToTopView> */}
        </View>
    )
}