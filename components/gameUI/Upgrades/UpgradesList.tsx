import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import { RootState } from '../../../scripts/redux/reduxStore';
import store from '../../../scripts/redux/reduxStore';
import { unlockUpgrade } from '../../../scripts/redux/upgradesSlice';
import { buyUpgrade, getUpgradeBonus } from '../../../scripts/game/upgrades/upgrades';
import { upgradeData } from '../../../scripts/game/upgrades/upgradeData/upgradeData';
import { UpgradeType } from '../../../scripts/game/upgrades/upgradeData/UpgradeType';
import { getUpgradePrice } from '../../../scripts/game/upgrades/upgradePrice';
import { buildingData } from '../../../scripts/game/buildings/buildingData';
import { buildingEmojis, pluralNames } from '../../../scripts/game/buildings/buildings';
import { formatNumber } from '../../../scripts/misc';
import Text from '../../generalUI/Text';
import ChunkyButton from '../../generalUI/ChunkyButton';
import { useBank, timeToAfford } from '../useBank';
import { howFun } from '../../../scripts/game/shorthands';
import { comboLevelOfTier } from '../../../scripts/game/upgrades/upgradeData/nonBuilding/combo';
import { palette, radii } from '../../misc/theme';

const BIG_EMOJI = "Big emoji";
const COLUMNS = 5;
const GAP = 10;

export const priceOf = (upgrade: UpgradeType) => getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.buildingId);
export const iconOf = (building?: string) => building === BIG_EMOJI ? "👆" : buildingEmojis[building ?? ""];

/** One chip per effect, e.g. "Drawing hands ×2", "Tapping +10%" */
export function effectChips(upgrade: UpgradeType) {
    return upgrade.categories.map(category => {
        switch (category) {
            case "Multiply building production": return `${pluralNames[upgrade.building!]} ×${upgrade.emojisPerSecondMultiplier}`;
            case "Multiply tap": return `Tapping ×${upgrade.emojisPerTapMultiplier}`;
            case "Percentage increase tap": return `Tapping +${Math.round(upgrade.emojisPerTapPercentageIncrease! * 100)}%`;
            case "Percentage increase production": return `Production +${Math.round(upgrade.emojisPerSecondPercentageIncrease! * 100)}%`;
            case "Tap percentage of eps": return `Taps +${Math.round(upgrade.emojisPerTapPercentageOfEps! * 100)}% of emojis/sec`;
            case "Combo level": return `Max combo ×${comboLevelOfTier(upgrade.tier)}`;
        }
    });
}

/** What buying it would add right now, e.g. "+7.5 /sec and +2.4 M per tap right now" */
function impactLine(upgradeId: number) {
    const [bonuses, , , suffixes] = getUpgradeBonus(upgradeId);
    const parts = bonuses.map((bonus, i) => `+${bonus} ${suffixes[i].includes("per second") ? "/sec" : "per tap"}`);
    return parts.length ? `${parts.join(" and ")} right now` : "";
}

export function tierLabel(upgrade: UpgradeType) {
    const building = (upgrade.building ?? "").toUpperCase();
    if (upgrade.variant === "Helper") return `${iconOf(upgrade.building)} ${building} · HELPER`;
    if (upgrade.variant === "Big emoji percentage") return `${iconOf(upgrade.building)} BIG EMOJI · HANDS`;
    if (upgrade.variant === "Combo level") return `🔥 COMBO · LEVEL ${comboLevelOfTier(upgrade.tier)}`;
    return `${iconOf(upgrade.building)} ${building} · TIER ${upgrade.tier + 1}`;
}

const toUpgrades = (ids: number[]) => ids
    .map(id => upgradeData.find(upgrade => upgrade.id === id))
    .filter((upgrade): upgrade is UpgradeType => upgrade !== undefined)
    .sort((a, b) => priceOf(a) - priceOf(b));

export default function UpgradesList() {
    const { unlocked, owned: ownedIds } = useSelector((state: RootState) => state.upgrades);
    const { emojis, emojisPerSecond } = useBank();

    // Upgrades for sale, or the ones you've bought
    const [view, setView] = useState<"available" | "owned">("available");
    const [filter, setFilter] = useState<string>("all");
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [gridWidth, setGridWidth] = useState(0);
    const alienTaps = useRef(0);

    // Unlocked, not-yet-owned upgrades, cheapest first
    const available = toUpgrades(unlocked);
    // Bought upgrades, in the order you'd have come across them
    const owned = toUpgrades(ownedIds);
    const list = view === "available" ? available : owned;
    const showingOwned = view === "owned";

    // One filter chip per building in the list, in shop order
    const filterBuildings = [
        ...buildingData.map(b => b.name).filter(name => list.some(u => u.building === name)),
        ...(list.some(u => u.building === BIG_EMOJI) ? [BIG_EMOJI] : []),
    ];
    const activeFilter = filter !== "all" && !filterBuildings.includes(filter) ? "all" : filter;
    const shown = list.filter(u => activeFilter === "all" || u.building === activeFilter);

    const selected = shown.find(u => u.id === selectedId) ?? shown[0];
    const affordableCount = available.filter(u => emojis >= priceOf(u)).length;

    const switchView = (next: "available" | "owned") => {
        setView(next);
        setSelectedId(undefined);
    };

    // Space station secret: tap its alien upgrade five times
    const onIconPress = () => {
        if (selected?.id !== 1104) return;
        alienTaps.current++;
        if (alienTaps.current === 5) store.dispatch(unlockUpgrade(899));
    };

    // Fun value 77: prices come with flying money
    const money = howFun(77) ? "💸 " : "";

    const tileSize = gridWidth > 0 ? (gridWidth - GAP * (COLUMNS - 1)) / COLUMNS : 0;

    const toggle = (
        <View style={styles.viewToggle} accessibilityRole="tablist">
            <ViewTab label="For sale" count={available.length} active={!showingOwned} onPress={() => switchView("available")} />
            <ViewTab label="Owned" count={owned.length} active={showingOwned} onPress={() => switchView("owned")} />
        </View>
    );

    if (list.length === 0) {
        return (
            <View style={styles.emptyScreen}>
                <View style={styles.emptyToggle}>{toggle}</View>
                <View style={styles.empty}>
                    <Text size={40}>{showingOwned ? "🛍️" : "🔒"}</Text>
                    <Text size={18}>{showingOwned ? "Nothing bought yet" : "No upgrades yet"}</Text>
                    <Text font="body" size={14} color={palette.lilac} style={{ textAlign: "center" }}>
                        {showingOwned
                            ? "Upgrades you buy will be collected here."
                            : "Buy buildings and tap the Big Emoji to unlock upgrades."}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.content}>
            {toggle}

            <View style={styles.filters}>
                <FilterChip label="All" active={activeFilter === "all"} onPress={() => setFilter("all")} />
                {filterBuildings.map(name => (
                    <FilterChip
                        key={name}
                        icon={iconOf(name)}
                        accessibilityLabel={name}
                        active={activeFilter === name}
                        onPress={() => setFilter(name)}
                    />
                ))}
            </View>

            {selected && (
                <View style={styles.detail}>
                    <View style={styles.detailHead}>
                        <Pressable onPress={onIconPress} style={styles.detailTile} accessibilityLabel={selected.name}>
                            <Text size={44} style={{ lineHeight: 54 }}>{selected.icon}</Text>
                        </Pressable>
                        <View style={styles.detailTitle}>
                            <View style={styles.tag}>
                                <Text font="black" size={11} color={palette.violetDeep} style={{ letterSpacing: 0.4 }} numberOfLines={1}>{tierLabel(selected)}</Text>
                            </View>
                            <Text size={22} color={palette.ink} style={{ lineHeight: 25 }}>{selected.name}</Text>
                        </View>
                    </View>
                    <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>{selected.description}</Text>
                    {selected.quote ? (
                        <Text font="italic" size={14} color={palette.violetDeep} style={{ lineHeight: 20 }}>"{selected.quote}"</Text>
                    ) : null}
                    <View style={styles.effects}>
                        {effectChips(selected).map(chip => (
                            <View key={chip} style={styles.effectChip}>
                                <Text font="black" size={12} color="#FFFFFF">{chip}</Text>
                            </View>
                        ))}
                    </View>
                    {showingOwned ? (
                        <View style={styles.ownedBar}>
                            <Text font="black" size={14} color={palette.greenText}>✓ OWNED</Text>
                            <Text font="bold" size={13} color={palette.muted}>Paid {money}{formatNumber(priceOf(selected), 2, true)}</Text>
                        </View>
                    ) : (
                        <>
                            <Text font="bold" size={13} color={palette.greenText}>{impactLine(selected.id!)}</Text>
                            <ChunkyButton
                                height={52}
                                labelSize={18}
                                label={emojis >= priceOf(selected)
                                    ? `Buy for ${money}${formatNumber(priceOf(selected), 2, true)}`
                                    : `${money}${formatNumber(priceOf(selected), 2, true)} · ${timeToAfford(priceOf(selected), emojis, emojisPerSecond).toLowerCase()}`}
                                disabled={emojis < priceOf(selected)}
                                onPress={() => buyUpgrade(selected.id!)}
                            />
                        </>
                    )}
                </View>
            )}

            <View style={styles.sectionHead}>
                <Text size={17}>{showingOwned ? "Owned" : "Available"}</Text>
                <Text font="bold" size={12} color={palette.lilac}>
                    {showingOwned
                        ? `${owned.length} of ${upgradeData.length} upgrades`
                        : `${affordableCount} affordable · ${available.length} unlocked`}
                </Text>
            </View>

            <View style={styles.grid} onLayout={(e: LayoutChangeEvent) => setGridWidth(e.nativeEvent.layout.width)}>
                {tileSize > 0 && shown.map(upgrade => {
                    const isSelected = upgrade.id === selected?.id;
                    // Owned upgrades always show as full, bright tiles
                    const canAfford = showingOwned || emojis >= priceOf(upgrade);
                    return (
                        <Pressable
                            key={upgrade.id}
                            onPress={() => setSelectedId(upgrade.id)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                            accessibilityLabel={showingOwned
                                ? `${upgrade.name}, owned`
                                : `${upgrade.name}, ${formatNumber(priceOf(upgrade), 2, true)}${canAfford ? ", affordable" : ""}`}
                            style={[
                                styles.tile,
                                { width: tileSize, height: tileSize },
                                isSelected ? styles.tileSelected : canAfford ? styles.tileAffordable : styles.tileLocked,
                            ]}
                        >
                            <Text size={Math.min(36, tileSize * 0.45)} style={{ opacity: isSelected || canAfford ? 1 : 0.45 }}>{upgrade.icon}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
}

/** A small tab inside the list, lighter than the Buildings / Upgrades control above it */
function ViewTab({ label, count, active, onPress }: { label: string, count: number, active: boolean, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${label}, ${count}`}
            style={[styles.viewTab, active ? styles.viewTabActive : null]}
        >
            <Text font="black" size={13} color={active ? "#FFFFFF" : palette.lilac}>{label}</Text>
            <View style={[styles.viewCount, active ? styles.viewCountActive : null]}>
                <Text font="black" size={11} color={active ? palette.ink : palette.lilac}>{count}</Text>
            </View>
        </Pressable>
    );
}

interface FilterChipProps {
    label?: string;
    icon?: string;
    active: boolean;
    accessibilityLabel?: string;
    onPress: () => void;
}

function FilterChip({ label, icon, active, accessibilityLabel, onPress }: FilterChipProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={accessibilityLabel ?? label}
            style={[styles.filterChip, label ? { paddingHorizontal: 16 } : { width: 48 }, active ? styles.filterChipActive : null]}
        >
            {label
                ? <Text font="black" size={13} color={active ? palette.ink : "#FFFFFF"}>{label}</Text>
                : <Text size={18} style={{ lineHeight: 24 }}>{icon}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 32,
        gap: 14,
    },
    viewToggle: {
        flexDirection: "row",
        gap: 6,
    },
    viewTab: {
        height: 34,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        paddingLeft: 14,
        paddingRight: 6,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: palette.glassLine,
    },
    viewTabActive: {
        backgroundColor: palette.violet,
        borderColor: palette.violet,
    },
    viewCount: {
        minWidth: 22,
        height: 22,
        paddingHorizontal: 6,
        borderRadius: 11,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    viewCountActive: {
        backgroundColor: palette.sun,
    },
    ownedBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        height: 44,
        borderRadius: radii.md,
        backgroundColor: palette.mint,
    },
    emptyScreen: {
        flex: 1,
    },
    emptyToggle: {
        paddingHorizontal: 20,
        paddingTop: 14,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 40,
    },
    filters: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    filterChip: {
        height: 36,
        borderRadius: 18,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    filterChipActive: {
        backgroundColor: palette.sun,
    },
    detail: {
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
        gap: 12,
    },
    detailHead: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    detailTile: {
        width: 72,
        height: 72,
        borderRadius: radii.lg,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    detailTitle: {
        flex: 1,
        gap: 4,
    },
    tag: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: palette.tile,
    },
    effects: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    effectChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: radii.sm,
        backgroundColor: palette.ink,
    },
    sectionHead: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginTop: 4,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
    },
    tile: {
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    tileSelected: {
        backgroundColor: palette.paper,
        borderWidth: 3,
        borderColor: palette.sun,
    },
    tileAffordable: {
        backgroundColor: palette.paper,
        borderBottomWidth: 4,
        borderBottomColor: palette.tileLedge,
    },
    tileLocked: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
});
