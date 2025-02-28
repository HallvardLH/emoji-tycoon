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

export default function UpgradesList() {
    const { unlocked, canBuy } = useSelector((state: RootState) => state.upgrades);
    const { bigEmoji } = useSelector((state: RootState) => state.bigEmoji);

    // Retrieve the corresponding upgrades from buildingUpgrades based on the unlocked indices,
    // including the original index in the object for later reference
    const unlockedUpgrades = unlocked.map(unlockedId => ({
        ...getUpgradeDataById(unlockedId),
        id: unlockedId
    }));

    // Sort the unlocked upgrades by price
    const sortedUnlockedUpgrades = unlockedUpgrades.sort((a, b) => getUpgradePrice(a.tier, a.variant, a.buildingId, a.tierPosition) - getUpgradePrice(b.tier, b.variant, b.buildingId, b.tierPosition));

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
            price={getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId, upgrade.tierPosition)}
            icon={upgrade.icon}
            buttonActive={canBuy.includes(upgrade.id)}
            onPress={() => buyUpgrade(upgrade.id)}
            onEmojiPress={upgrade.id == 84 ? alienSecret : undefined}
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
        <>
            {/* <UpgradesListFilter /> */}
            <FlatList
                contentContainerStyle={{
                    paddingTop: 24,
                }}
                data={sortedUnlockedUpgrades}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </>
    );
}
