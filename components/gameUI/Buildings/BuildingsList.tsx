import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { RootState } from '../../../scripts/redux/reduxStore';
import BuildingListItem, { MysteryBuildingItem } from './BuildingListItem';
import { buildingData } from '../../../scripts/game/buildings/buildingData';
import { buyBuilding, calculateBuildingPrice, resolveBuyAmount } from '../../../scripts/game/buildings/buildings';
import { getNextUpgradeRequirement } from '../../../scripts/game/upgrades/checks';
import { formatNumber } from '../../../scripts/misc';
import { useBank, timeToAfford } from '../useBank';

export interface BuildingInfo {
    name: string;
    buildingId: number;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

export default function BuildingsList() {
    const { buildings } = useSelector((state: RootState) => state.buildings);
    const { bulkBuy } = useSelector((state: RootState) => state.preferences);
    const { totalBuildingEps } = useSelector((state: RootState) => state.values);
    // Re-read so the next-upgrade progress updates when upgrades unlock
    useSelector((state: RootState) => state.upgrades.unlocked);
    const { emojis, emojisPerSecond } = useBank();

    // Building EPS is before global bonuses; scale it so rows add up to the header's number
    const globalFactor = totalBuildingEps > 0 ? emojisPerSecond / totalBuildingEps : 1;

    const nextLocked = buildings.find(b => !b.unlocked);

    return (
        <View style={styles.list}>
            {buildingData.map((building: BuildingInfo) => {
                const dynamicData = buildings.find(b => b.buildingId === building.buildingId);
                if (!dynamicData || !dynamicData.unlocked) return null;

                const price = calculateBuildingPrice(building.buildingId, bulkBuy);
                const buyCount = resolveBuyAmount(building.buildingId, bulkBuy);
                const epsEach = building.baseEps * dynamicData.epsMultipliers.filter(m => m !== 0).reduce((a, m) => a * m, 1) * globalFactor;
                const share = totalBuildingEps > 0 ? (dynamicData.eps / totalBuildingEps) * 100 : 0;

                return (
                    <BuildingListItem
                        key={building.name}
                        name={building.name}
                        icon={building.icon}
                        description={building.description}
                        price={formatNumber(price, 2, true)}
                        amount={dynamicData.amount}
                        eps={formatNumber(dynamicData.eps * globalFactor, 1, true)}
                        share={share < 0.1 ? "<0.1%" : `${share < 10 ? share.toFixed(1) : Math.round(share)}%`}
                        epsEach={formatNumber(epsEach, 1, true)}
                        nextUpgradeAt={getNextUpgradeRequirement(building.name)}
                        buyCount={buyCount}
                        affordable={emojis >= price}
                        waitLabel={timeToAfford(price, emojis, emojisPerSecond)}
                        onPress={() => buyBuilding(building.buildingId)}
                    />
                );
            })}
            {nextLocked && (
                <MysteryBuildingItem revealAt={formatNumber(nextLocked.price / 4, 2)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        gap: 10,
    },
});
