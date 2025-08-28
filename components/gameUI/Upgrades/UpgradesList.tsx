import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import UpgradeListItem from './UpgradeListItem';
import { getEffectText, buyUpgrade } from '../../../scripts/game/upgrades/upgrades';
import UpgradesListFilter from './UpgradesListFilter';
import { getUpgradeDataById } from '../../../scripts/game/upgrades/shorthands';
import { getUpgradePrice } from '../../../scripts/game/upgrades/upgradePrice';
import { FlatList } from 'react-native';
import store from '../../../scripts/redux/reduxStore';
import { unlockUpgrade } from '../../../scripts/redux/upgradesSlice';
import Text from '../../generalUI/Text';
import { upgradeFilters } from '../../../scripts/redux/preferencesSlice';

export default function UpgradesList() {
    const { unlocked, canBuy } = useSelector((state: RootState) => state.upgrades);
    const { bigEmoji } = useSelector((state: RootState) => state.bigEmoji);
    const { upgradeFilter } = useSelector((state: RootState) => state.preferences);

    // Retrieve the corresponding upgrades from buildingUpgrades based on the unlocked indices,
    // including the original index in the object for later reference
    const unlockedUpgrades = unlocked.map(unlockedId => ({
        ...getUpgradeDataById(unlockedId),
        id: unlockedId
    }));

    // Sort the unlocked upgrades by price
    let sortedUnlockedUpgrades = unlockedUpgrades.sort((a, b) => getUpgradePrice(a.tier, a.variant, a.buildingId) - getUpgradePrice(b.tier, b.variant, b.buildingId));

    // Filter out upgrades that are not selected in the filter
    sortedUnlockedUpgrades = sortedUnlockedUpgrades.filter((upgrade) => {
        if (upgradeFilter.includes("all")) { return true }
        return upgradeFilter.includes(upgrade.building as upgradeFilters);
    })

    const renderItem = ({ item: upgrade }: any) => (
        <UpgradeListItem
            key={upgrade.id} // Use the original index as the key
            id={upgrade.id}
            name={upgrade.name}
            buildingName={upgrade.building}
            buildingIcon={upgrade.building == "Big emoji" ? bigEmoji.emoji : undefined}
            description={upgrade.description}
            quote={upgrade.quote}
            effect={getEffectText(upgrade.id)}
            price={getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId)}
            icon={upgrade.icon}
            buttonActive={canBuy.includes(upgrade.id)}
            onPress={() => buyUpgrade(upgrade.id)}
            onEmojiPress={upgrade.id == 1104 ? alienSecret : undefined}
        />
    );

    let taps = 0
    const alienSecret = () => {
        taps++;
        if (taps == 5) {
            store.dispatch(unlockUpgrade(899));
        }
    }

    return (
        <FlatList
            contentContainerStyle={{
                paddingTop: 24,
            }}
            data={sortedUnlockedUpgrades}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
}
