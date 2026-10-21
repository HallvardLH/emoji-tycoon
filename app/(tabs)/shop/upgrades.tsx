import UpgradesList from "../../../components/gameUI/Upgrades/UpgradesList";
import ScreenView from "../../../components/layout/ScreenView";

export default function UpgradesTab() {
    return (
        <ScreenView scrollView={false} style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
            <UpgradesList />
        </ScreenView>
    )
}
