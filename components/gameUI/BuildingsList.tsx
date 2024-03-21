import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import BuildingListItem from './BuildingListItem';
import { buildingData } from '../../scripts/data/buildingData';
import { buyBuilding } from '../../scripts/game/buildings';
import { formatNumber } from '../../scripts/misc';

export interface BuildingInfo {
    name: string,
    icon: string,
    description: string,
    basePrice: number,
    baseEps: number,
}

export default function BuildingsList() {
    const { buildings, emojis } = useSelector((state: RootState) => state.values);

    return (
        <>
            {buildingData.map((building: BuildingInfo) => {
                // Match the building from Redux state to get the dynamic data, like amount
                const dynamicData = buildings[building.name];
                return (
                    <BuildingListItem
                        name={building.name}
                        key={building.name}
                        icon={building.icon}
                        description={building.description}
                        price={formatNumber(dynamicData.price)}
                        eps={formatNumber(dynamicData.eps)}
                        amount={dynamicData ? dynamicData.amount : 0}
                        amountFontSize={dynamicData.amount < 1000 ? 30 : 26}
                        buttonActive={emojis >= dynamicData.price}
                        onPress={() => buyBuilding(building.name)}
                    />
                );
            })}
        </>
    );
}

