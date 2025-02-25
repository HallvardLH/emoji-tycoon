import { upgradeData } from "../../scripts/game/upgrades/upgradeData/upgradeData";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Emoji from "../../components/gameUI/Emoji";
import Text from "../../components/generalUI/Text";
import { getUpgradePrice } from "../../scripts/game/upgrades/upgradePrice";
import { formatNumber } from "../../scripts/misc";
import { getBaseBuildingPrice } from "../../scripts/game/buildings/buildingData";
import { getBuildingIdFromName } from "../../scripts/game/buildings/shorthands";

export default function Upgrades() {
    const { owned } = useSelector((state: RootState) => state.upgrades);

    // Add `originalIndex` to each upgrade
    const indexedUpgradeData = upgradeData.map((upgrade, index) => ({
        ...upgrade,
        originalIndex: index,
    }));

    // Group upgrades by buildingId
    const groupedUpgrades = indexedUpgradeData.reduce((acc: Record<number, any[]>, upgrade) => {
        if (!acc[upgrade.buildingId!]) {
            acc[upgrade.buildingId!] = [];
        }
        acc[upgrade.buildingId!].push(upgrade);
        return acc;
    }, {});

    return (
        <ScrollView style={styles.container}>
            {Object.keys(groupedUpgrades).map((buildingId) => {
                const upgrades = groupedUpgrades[parseInt(buildingId)];
                const buildingName = upgrades[0]?.building || `Building ${buildingId}`;

                return (
                    <View key={buildingId} style={styles.section}>
                        <Text style={styles.header}>{buildingName}</Text>
                        <Text style={{ textAlign: "center" }}>Base price: {formatNumber(getBaseBuildingPrice(getBuildingIdFromName(buildingName)))}</Text>
                        <View style={styles.upgradesContainer}>
                            {upgrades.map((upgrade) => (
                                <View style={styles.upgrade} key={upgrade.id}>
                                    {/* <Emoji icon={owned.includes(upgrade.id) ? upgrade.icon : "🔒"}></Emoji> */}
                                    <Emoji icon={upgrade.icon}></Emoji>
                                    <Text>{formatNumber(getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId, upgrade.tierPosition), 0, true)}</Text>
                                    <Text>{upgrade.id}</Text>
                                    {/* <Text style={styles.upgradeText}>
                                        {upgrade.icon} {upgrade.name} (ID: {upgrade.originalIndex})
                                    </Text> */}
                                    {/* <Text style={styles.description}>{upgrade.description}</Text> */}
                                    {/* <Text style={styles.price}>Price: {upgrade.price}</Text> */}
                                </View>
                            ))}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    upgradesContainer: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "center",
    },

    upgrade: {
        width: "30%",
        justifyContent: "center",
        alignItems: "center",
    },

    section: {
        marginBottom: 24,
    },
    header: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: "center",
    },
    upgradeText: {
        fontSize: 16,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
});
