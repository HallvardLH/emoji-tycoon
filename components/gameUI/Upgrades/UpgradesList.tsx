import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import UpgradeListItem from './UpgradeListItem';
import { getEffectText, buyUpgrade } from '../../../scripts/game/upgrades/upgrades';
import UpgradesListFilter from './UpgradesListFilter';
import { getUpgradeDataById } from '../../../scripts/game/upgrades/shorthands';
import { getUpgradePrice } from '../../../scripts/game/upgrades/upgradePrice';
import { FlatList } from 'react-native';

export default function UpgradesList() {
    const { unlocked, canBuy } = useSelector((state: RootState) => state.upgrades);

    // Retrieve the corresponding upgrades from buildingUpgrades based on the unlocked indices,
    // including the original index in the object for later reference
    const unlockedUpgrades = unlocked.map(unlockedId => ({
        ...getUpgradeDataById(unlockedId),
        originalIndex: unlockedId
    }));

    // Sort the unlocked upgrades by price
    const sortedUnlockedUpgrades = unlockedUpgrades.sort((a, b) => getUpgradePrice(a.tier, a.variant, a.buildingId, a.tierPosition) - getUpgradePrice(b.tier, b.variant, b.buildingId, b.tierPosition));

    const renderItem = ({ item: upgrade }: any) => (
        <UpgradeListItem
            key={upgrade.originalIndex} // Use the original index as the key
            id={upgrade.originalIndex}
            name={upgrade.name}
            buildingName={upgrade.building}
            description={upgrade.description}
            effect={getEffectText(upgrade.originalIndex)}
            price={getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId, upgrade.tierPosition)}
            icon={upgrade.icon}
            buttonActive={canBuy.includes(upgrade.originalIndex)}
            onPress={() => buyUpgrade(upgrade.originalIndex)}
        />
    );

    return (
        <>
            {/* <UpgradesListFilter /> */}
            <FlatList
                contentContainerStyle={{
                    paddingTop: 24,
                }}
                data={sortedUnlockedUpgrades}
                renderItem={renderItem}
                keyExtractor={(item) => item.originalIndex.toString()}
            />
        </>
    );
}
