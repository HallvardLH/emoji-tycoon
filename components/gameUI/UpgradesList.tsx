import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { buildingUpgrades } from '../../scripts/game/upgrades/upgradeData';
import UpgradeListItem from './UpgradeListItem';
import { getEffectText, buyUpgrade } from '../../scripts/game/upgrades/upgrades';

export default function UpgradesList() {
    const { unlocked } = useSelector((state: RootState) => state.upgrades);

    // Retrieve the corresponding upgrades from buildingUpgrades based on the unlocked indices,
    // including the original index in the object for later reference
    const unlockedUpgrades = unlocked.map(unlockedIndex => ({
        ...buildingUpgrades[unlockedIndex],
        originalIndex: unlockedIndex
    }));

    // Sort the unlocked upgrades by price
    const sortedUnlockedUpgrades = unlockedUpgrades.sort((a, b) => a.price - b.price);

    return (
        <>
            {sortedUnlockedUpgrades.map((upgrade) => (
                <UpgradeListItem
                    key={upgrade.originalIndex} // Use the original index as the key
                    name={upgrade.name}
                    description={upgrade.description}
                    effect={getEffectText(upgrade.originalIndex)} // Pass the original index to getEffectText
                    price={upgrade.price}
                    icon={upgrade.icon}
                    buttonActive={true} // Assuming you want the button always active, adjust if necessary
                    onPress={() => buyUpgrade(upgrade.originalIndex)} // Implement the function to handle the press action
                />
            ))}
        </>
    );
}
