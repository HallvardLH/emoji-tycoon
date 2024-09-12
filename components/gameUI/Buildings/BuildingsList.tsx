import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import BuildingListItem from './BuildingListItem';
import { buildingData } from '../../../scripts/game/buildings/buildingData';
import { buyBuilding } from '../../../scripts/game/buildings/buildings';
import { formatNumber } from '../../../scripts/misc';
import { View } from 'react-native';

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

    return (
        <>
            {buildingData.map((building: BuildingInfo) => {
                // Find the building from Redux state using buildingId instead of name
                const dynamicData = buildings.find(b => b.buildingId === building.buildingId);

                // If no dynamic data is found (or building is locked), return null
                if (!dynamicData || !dynamicData.unlocked) return null;

                return (
                    <View key={building.icon}>
                        <BuildingListItem
                            name={building.name}
                            key={building.name}
                            icon={building.icon}
                            description={building.description}
                            price={formatNumber(dynamicData.price)}
                            baseEps={building.baseEps * Math.pow(2, dynamicData.upgrades)}
                            upgradeAmount={dynamicData.upgrades}
                            eps={formatNumber(dynamicData.eps)}
                            amount={dynamicData.amount}
                            buttonActive={dynamicData.canBuy}
                            onPress={() => buyBuilding(building.buildingId)}
                        />
                    </View>
                );
            })}
        </>
    );
}
