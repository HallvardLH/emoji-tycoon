import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import BuildingListItem from './BuildingListItem';
import { buildingData } from '../../scripts/data/buildingData';
import { buyBuilding } from '../../scripts/game/buildings/buildings';
import { formatNumber } from '../../scripts/misc';

export interface BuildingInfo {
    name: string,
    icon: string,
    description: string,
    basePrice: number,
    baseEps: number,
}

export default function BuildingsList() {
    const { buildings } = useSelector((state: RootState) => state.buildings);
    return (
        <>
            {buildingData.map((building: BuildingInfo) => {
                // Match the building from Redux state to get the dynamic data, like amount
                const dynamicData = buildings[building.name];
                return (
                    <>
                        {dynamicData.unlocked && (
                            <BuildingListItem
                                name={building.name}
                                key={building.name}
                                icon={building.icon}
                                description={building.description}
                                price={formatNumber(dynamicData.price)}
                                baseEps={building.baseEps * Math.pow(2, dynamicData.upgrades)}
                                upgradeAmount={dynamicData.upgrades}
                                eps={formatNumber(dynamicData.eps)}
                                amount={dynamicData ? dynamicData.amount : 0}
                                buttonActive={dynamicData.canBuy}
                                onPress={() => buyBuilding(building.name)}
                            />
                        )}
                    </>
                );
            })}
        </>
    );
}

