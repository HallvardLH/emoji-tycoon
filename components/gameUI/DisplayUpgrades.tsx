import Emoji from "./Emoji";
import { getDisplayUpgrades } from "../../scripts/game/upgrades/upgrades";
import { View } from "react-native";

interface DisplayUpgradesProps {
    buildingName: string;
}

export default function DisplayUpgrades(props: DisplayUpgradesProps) {
    const { buildingName } = props;
    const upgrades = getDisplayUpgrades(buildingName);
    return (
        <View style={{
            flexDirection: "row"
        }}>
            {upgrades.map((upgrade, index) => (
                <View key={index} style={{
                    // marginLeft: -5
                }}>
                    <Emoji size={25} icon={upgrade} />
                </View>
            ))}
        </View>
    )
}