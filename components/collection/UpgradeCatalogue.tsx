import { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import { upgradeData } from "../../scripts/game/upgrades/upgradeData/upgradeData";
import { UpgradeType } from "../../scripts/game/upgrades/upgradeData/UpgradeType";
import { buildingData } from "../../scripts/game/buildings/buildingData";
import { pluralNames } from "../../scripts/game/buildings/buildings";
import { getBuildingUnlockRequirement } from "../../scripts/game/upgrades/checks";
import { COMBO_LEVEL_UNLOCK_TAPS } from "../../scripts/game/upgrades/upgradeData/nonBuilding/combo";
import { formatNumber } from "../../scripts/misc";
import { priceOf, iconOf, effectChips, tierLabel } from "../gameUI/Upgrades/UpgradesList";
import Text from "../generalUI/Text";
import { palette, radii } from "../misc/theme";

type UpgradeState = "owned" | "forSale" | "locked";
type Filter = "all" | UpgradeState;

const COLUMNS = 5;
const GAP = 8;
const COMBO = "Combo";

interface Section {
    name: string;
    icon: string;
    upgrades: UpgradeType[];
}

/** Big Emoji hands, combo levels, then each building in shop order; cheapest first within each */
function buildSections(): Section[] {
    const byPrice = (a: UpgradeType, b: UpgradeType) => priceOf(a) - priceOf(b);
    const combo = upgradeData.filter(u => u.variant === "Combo level").sort(byPrice);
    const hands = upgradeData.filter(u => u.building === "Big emoji" && u.variant !== "Combo level").sort(byPrice);
    return [
        { name: "Big emoji", icon: iconOf("Big emoji"), upgrades: hands },
        { name: COMBO, icon: "🔥", upgrades: combo },
        ...buildingData.map(building => ({
            name: building.name,
            icon: iconOf(building.name),
            upgrades: upgradeData.filter(u => u.building === building.name && u.variant !== "Combo level").sort(byPrice),
        })),
    ].filter(section => section.upgrades.length > 0);
}

/** What it takes for an upgrade to show up in the shop */
function unlockText(upgrade: UpgradeType) {
    const plural = pluralNames[upgrade.building ?? ""] ?? upgrade.building;
    switch (upgrade.unlockCondition) {
        case "Building amount": return `Own ${getBuildingUnlockRequirement(upgrade.tier)} ${plural}`;
        case "Building helper": return `Own ${(upgrade.tier + 1) * 10} ${plural}`;
        case "Emojis from tapping": return `Earn ${formatNumber(Math.pow(10, upgrade.tier + 2), 0)} emojis from tapping`;
        case "Combo taps": return `${formatNumber(COMBO_LEVEL_UNLOCK_TAPS[upgrade.tier], 0)} combo taps`;
    }
}

const stateLabel: Record<UpgradeState, string> = { owned: "✓ OWNED", forSale: "FOR SALE", locked: "🔒 LOCKED" };

/** Every upgrade in the game, grouped and marked owned / for sale / locked */
export default function UpgradeCatalogue() {
    const { owned, unlocked } = useSelector((state: RootState) => state.upgrades);
    const [filter, setFilter] = useState<Filter>("all");
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [gridWidth, setGridWidth] = useState(0);

    const sections = useMemo(buildSections, []);
    const stateOf = (upgrade: UpgradeType): UpgradeState =>
        owned.includes(upgrade.id!) ? "owned" : unlocked.includes(upgrade.id!) ? "forSale" : "locked";

    const total = upgradeData.length;
    const counts = { owned: 0, forSale: 0, locked: 0 };
    upgradeData.forEach(upgrade => counts[stateOf(upgrade)]++);
    const percentage = total > 0 ? (counts.owned / total) * 100 : 0;

    const tileSize = gridWidth > 0 ? (gridWidth - GAP * (COLUMNS - 1)) / COLUMNS : 0;

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.summary}>
                <View style={styles.summaryHead}>
                    <Text size={20} color={palette.ink}>All upgrades</Text>
                    <Text size={17} color={palette.violetDeep}>{Math.floor(percentage)}%</Text>
                </View>
                <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.max(percentage, counts.owned > 0 ? 1 : 0)}%` }]} />
                </View>
                <Text font="bold" size={13} color={palette.muted}>
                    {counts.owned} owned · {counts.forSale} for sale · {counts.locked} locked · {total} total
                </Text>
            </View>

            <View style={styles.filters}>
                <FilterChip label="All" active={filter === "all"} onPress={() => setFilter("all")} />
                <FilterChip label={`Owned ${counts.owned}`} active={filter === "owned"} onPress={() => setFilter("owned")} />
                <FilterChip label={`For sale ${counts.forSale}`} active={filter === "forSale"} onPress={() => setFilter("forSale")} />
                <FilterChip label={`Locked ${counts.locked}`} active={filter === "locked"} onPress={() => setFilter("locked")} />
            </View>

            {sections.map(section => {
                const shown = section.upgrades.filter(u => filter === "all" || stateOf(u) === filter);
                if (shown.length === 0) return null;
                const ownedHere = section.upgrades.filter(u => stateOf(u) === "owned").length;
                const selected = shown.find(u => u.id === selectedId);

                return (
                    <View key={section.name} style={styles.section}>
                        <View style={styles.sectionHead}>
                            <View style={styles.sectionIcon}>
                                <Text size={20} style={{ lineHeight: 26 }}>{section.icon}</Text>
                            </View>
                            <View style={{ flex: 1, gap: 4 }}>
                                <Text size={16} numberOfLines={1}>{section.name}</Text>
                                <View style={styles.miniTrack}>
                                    <View style={[styles.miniFill, { width: `${(ownedHere / section.upgrades.length) * 100}%` }]} />
                                </View>
                            </View>
                            <Text font="black" size={13} color={palette.lilac}>{ownedHere}/{section.upgrades.length}</Text>
                        </View>

                        <View style={styles.grid} onLayout={(e: LayoutChangeEvent) => setGridWidth(e.nativeEvent.layout.width)}>
                            {tileSize > 0 && shown.map(upgrade => {
                                const state = stateOf(upgrade);
                                const isSelected = upgrade.id === selectedId;
                                return (
                                    <Pressable
                                        key={upgrade.id}
                                        onPress={() => setSelectedId(isSelected ? undefined : upgrade.id)}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: isSelected }}
                                        accessibilityLabel={`${upgrade.name}, ${stateLabel[state].replace(/[^A-Z ]/g, "").trim().toLowerCase()}`}
                                        style={[
                                            styles.tile,
                                            { width: tileSize, height: tileSize },
                                            state === "owned" ? styles.tileOwned : state === "forSale" ? styles.tileForSale : styles.tileLocked,
                                            isSelected ? styles.tileSelected : null,
                                        ]}
                                    >
                                        <Text size={Math.min(30, tileSize * 0.44)} style={{ opacity: state === "locked" ? 0.35 : 1 }}>{upgrade.icon}</Text>
                                        {state === "owned" && (
                                            <View style={styles.check}>
                                                <Text font="black" size={9} color="#FFFFFF" style={{ lineHeight: 11 }}>✓</Text>
                                            </View>
                                        )}
                                        {state === "forSale" && <View style={styles.saleDot} />}
                                    </Pressable>
                                );
                            })}
                        </View>

                        {selected && <UpgradeDetail upgrade={selected} state={stateOf(selected)} />}
                    </View>
                );
            })}
        </ScrollView>
    );
}

function UpgradeDetail({ upgrade, state }: { upgrade: UpgradeType, state: UpgradeState }) {
    const stateStyle = state === "owned"
        ? { backgroundColor: palette.mint, color: palette.greenText }
        : state === "forSale"
            ? { backgroundColor: "#FFF1CC", color: palette.sunLedge }
            : { backgroundColor: palette.tile, color: palette.muted };

    return (
        <View style={styles.detail}>
            <View style={styles.detailHead}>
                <View style={styles.detailTile}>
                    <Text size={36} style={{ lineHeight: 44 }}>{upgrade.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.detailTags}>
                        <View style={styles.tag}>
                            <Text font="black" size={10} color={palette.violetDeep} numberOfLines={1}>{tierLabel(upgrade)}</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: stateStyle.backgroundColor }]}>
                            <Text font="black" size={10} color={stateStyle.color}>{stateLabel[state]}</Text>
                        </View>
                    </View>
                    <Text size={19} color={palette.ink} style={{ lineHeight: 22 }}>{upgrade.name}</Text>
                </View>
            </View>
            <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>{upgrade.description}</Text>
            {upgrade.quote ? (
                <Text font="italic" size={14} color={palette.violetDeep} style={{ lineHeight: 20 }}>"{upgrade.quote}"</Text>
            ) : null}
            <View style={styles.effects}>
                {effectChips(upgrade).map(chip => (
                    <View key={chip} style={styles.effectChip}>
                        <Text font="black" size={12} color="#FFFFFF">{chip}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.facts}>
                <Fact label="PRICE" value={formatNumber(priceOf(upgrade), 2, true)} />
                <Fact label="UNLOCKS" value={unlockText(upgrade)} />
                <Fact label="ID" value={`#${upgrade.id}`} />
            </View>
        </View>
    );
}

function Fact({ label, value }: { label: string, value: string }) {
    return (
        <View style={styles.fact}>
            <Text font="black" size={10} color={palette.muted} style={{ letterSpacing: 0.8 }}>{label}</Text>
            <Text font="bold" size={13} color={palette.ink}>{value}</Text>
        </View>
    );
}

function FilterChip({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.filterChip, active ? styles.filterChipActive : null]}
        >
            <Text font="black" size={13} color={active ? palette.ink : "#FFFFFF"}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 40,
        gap: 16,
    },
    summary: {
        padding: 16,
        gap: 10,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    summaryHead: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    track: {
        height: 10,
        borderRadius: 5,
        backgroundColor: palette.track,
        overflow: "hidden",
    },
    fill: {
        height: 10,
        borderRadius: 5,
        backgroundColor: palette.violet,
    },
    filters: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    filterChip: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    filterChipActive: {
        backgroundColor: palette.sun,
    },
    section: {
        gap: 10,
    },
    sectionHead: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sectionIcon: {
        width: 38,
        height: 38,
        borderRadius: radii.sm,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    miniTrack: {
        height: 4,
        borderRadius: 2,
        backgroundColor: palette.glass,
        overflow: "hidden",
    },
    miniFill: {
        height: 4,
        borderRadius: 2,
        backgroundColor: palette.sun,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
    },
    tile: {
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    tileOwned: {
        backgroundColor: palette.paper,
        borderBottomWidth: 4,
        borderBottomColor: palette.tileLedge,
    },
    tileForSale: {
        backgroundColor: "rgba(255,255,255,0.14)",
        borderWidth: 2,
        borderColor: palette.sun,
    },
    tileLocked: {
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    tileSelected: {
        borderWidth: 3,
        borderBottomWidth: 3,
        borderColor: palette.pop,
        borderBottomColor: palette.pop,
    },
    check: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 15,
        height: 15,
        borderRadius: 8,
        backgroundColor: palette.green,
        alignItems: "center",
        justifyContent: "center",
    },
    saleDot: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.sun,
    },
    detail: {
        padding: 14,
        gap: 10,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    detailHead: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    detailTile: {
        width: 60,
        height: 60,
        borderRadius: radii.md,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    detailTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
    },
    tag: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 7,
        backgroundColor: palette.tile,
    },
    effects: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    effectChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radii.sm,
        backgroundColor: palette.ink,
    },
    facts: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    fact: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 7,
        gap: 1,
        borderRadius: radii.sm,
        backgroundColor: palette.tile,
    },
});
