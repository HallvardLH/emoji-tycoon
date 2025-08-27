import { View } from "react-native";
import UpgradesList from "../../../components/gameUI/Upgrades/UpgradesList";
import { useSelector } from 'react-redux';
import { RootState } from "../../../scripts/redux/reduxStore";
import UpgradesListFilter from "../../../components/gameUI/Upgrades/UpgradesListFilter";
import ScreenView from "../../../components/layout/ScreenView";

export default function UpgradesTab() {
    const { upgradeFilter } = useSelector((state: RootState) => state.preferences);
    return (
        <ScreenView scrollView={false}>
            <View style={{ width: "100%" }}>
                {/* <View style={{
                position: "absolute",
                right: 20,
            }}>
                <UpgradesListFilter selected={upgradeFilter} />
            </View> */}
                <UpgradesList />
            </View>
        </ScreenView>
    )
}