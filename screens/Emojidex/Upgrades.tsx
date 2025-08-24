import { upgradeData } from "../../scripts/game/upgrades/upgradeData/upgradeData";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Emoji from "../../components/gameUI/Emoji";
import Text from "../../components/generalUI/Text";
import { getUpgradePrice } from "../../scripts/game/upgrades/upgradePrice";
import { formatNumber } from "../../scripts/misc";
import { getBaseBuildingPrice } from "../../scripts/game/buildings/buildingData";
import { getBuildingIdFromName } from "../../scripts/game/buildings/shorthands";
import { useMemo } from "react";

export default function Upgrades() {
    const { owned } = useSelector((state: RootState) => state.upgrades);

    // Prepare the data for FlatList
    const sections = useMemo(() => {
        // Add originalIndex to each upgrade
        // This is necessary to keep track of the original order after grouping
        const indexedUpgradeData = upgradeData.map((upgrade, index) => ({
            ...upgrade,
            originalIndex: index,
        }));

        // Group upgrades by buildingId and convert to array format
        return Object.entries(
            indexedUpgradeData.reduce((acc: Record<number, any[]>, upgrade) => {
                if (!acc[upgrade.buildingId!]) {
                    acc[upgrade.buildingId!] = [];
                }
                acc[upgrade.buildingId!].push(upgrade);
                return acc;
            }, {})
        ).map(([buildingId, upgrades]) => ({
            buildingId: parseInt(buildingId),
            buildingName: upgrades[0]?.building || `Building ${buildingId}`,
            data: upgrades,
        }));
    }, []);

    const renderItem = ({ item }: { item: typeof sections[0] }) => {
        return (
            <View style={styles.section}>
                <Text style={styles.header}>{item.buildingName}</Text>
                <Text style={{ textAlign: "center" }}>
                    Base price: {formatNumber(getBaseBuildingPrice(getBuildingIdFromName(item.buildingName)))}
                </Text>
                <FlatList
                    data={item.data}
                    renderItem={({ item: upgrade }) => (
                        <View style={styles.upgrade} key={upgrade.id}>
                            <Emoji icon={upgrade.icon}></Emoji>
                            <Text>
                                {formatNumber(
                                    getUpgradePrice(
                                        upgrade.tier,
                                        upgrade.variant,
                                        upgrade.buildingId,
                                        upgrade.tierPosition
                                    ),
                                    0,
                                    true
                                )}
                            </Text>
                            <Text>{upgrade.id}</Text>
                        </View>
                    )}
                    keyExtractor={(upgrade) => upgrade.id.toString()}
                    numColumns={4}
                    columnWrapperStyle={styles.upgradesContainer}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    return (
        <FlatList
            data={sections}
            renderItem={renderItem}
            keyExtractor={(item) => item.buildingId.toString()}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    upgradesContainer: {
        gap: 10,
        justifyContent: "center",
    },
    upgrade: {
        width: "20%",
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
});