import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import OwnedUpgradeListItem from './OwnedUpgradeListItem';
import { getEffectText, buyUpgrade } from '../../../scripts/game/upgrades/upgrades';
import { getUpgradeDataById } from '../../../scripts/game/upgrades/shorthands';
import { getUpgradePrice } from '../../../scripts/game/upgrades/upgradePrice';
import { FlatList } from 'react-native';

export default function OwnedUpgradesList() {
    const { owned } = useSelector((state: RootState) => state.upgrades);
    const { bigEmoji } = useSelector((state: RootState) => state.bigEmoji);

    // Retrieve the corresponding upgrades from buildingUpgrades based on the unlocked indices,
    // including the original index in the object for later reference
    const ownedUpgrades = owned.map(id => ({
        ...getUpgradeDataById(id),
        originalIndex: id
    }));

    // Sort the unlocked upgrades by price
    const sortedUnlockedUpgrades = ownedUpgrades.sort((a, b) => getUpgradePrice(a.tier, a.variant, a.buildingId) - getUpgradePrice(b.tier, b.variant, b.buildingId));

    const renderItem = ({ item: upgrade }: any) => (
        <OwnedUpgradeListItem
            key={upgrade.originalIndex} // Use the original index as the key
            id={upgrade.originalIndex}
            name={upgrade.name}
            buildingName={upgrade.building}
            buildingIcon={upgrade.building == "Big emoji" ? bigEmoji.emoji : undefined}
            description={upgrade.description}
            effect={getEffectText(upgrade.originalIndex)}
            price={getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId)}
            icon={upgrade.icon}
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
