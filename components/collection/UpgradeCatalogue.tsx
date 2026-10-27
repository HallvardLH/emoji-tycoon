import { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, LayoutChangeEvent, Platform, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import { upgradeData } from "../../scripts/game/upgrades/upgradeData/upgradeData";
import { UpgradeType } from "../../scripts/game/upgrades/upgradeData/UpgradeType";
import { buildingData } from "../../scripts/game/buildings/buildingData";
import { pluralNames } from "../../scripts/game/buildings/buildings";
import { getBuildingUnlockRequirement } from "../../scripts/game/upgrades/checks";
import { COMBO_LEVEL_UNLOCK_TAPS } from "../../scripts/game/upgrades/upgradeData/nonBuilding/combo";
import { EFFECT_EMOJI_UNLOCK_EARNED } from "../../scripts/game/upgrades/upgradeData/nonBuilding/effectEmojis";
import { formatNumber } from "../../scripts/misc";
import { priceOf, iconOf, effectChips, tierLabel, tileGrid } from "../gameUI/Upgrades/UpgradesList";
import Text from "../generalUI/Text";
import Modal from "../generalUI/Modal";
import { palette, radii, themedStyles } from "../misc/theme";

type UpgradeState = "owned" | "forSale" | "locked";
type Filter = "all" | UpgradeState;

const COLUMNS = 5;
const GAP = 8;
const PADDING = 20;
const COMBO = "Combo";

interface Section {
    name: string;
    icon: string;
    upgrades: UpgradeType[];
}

/** Big Emoji hands, combo levels, effect emojis, then each building in shop order; cheapest first within each */
function buildSections(): Section[] {
    const byPrice = (a: UpgradeType, b: UpgradeType) => priceOf(a) - priceOf(b);
    // Combo and effect emoji upgrades belong to the Big Emoji, but get their own sections
    const ownSection = (u: UpgradeType) => u.variant === "Combo level" || u.variant === "Effect emojis";
    const combo = upgradeData.filter(u => u.variant === "Combo level").sort(byPrice);
    const effectEmojis = upgradeData.filter(u => u.variant === "Effect emojis").sort(byPrice);
    const hands = upgradeData.filter(u => u.building === "Big emoji" && !ownSection(u)).sort(byPrice);
    return [
        { name: "Big emoji", icon: iconOf("Big emoji"), upgrades: hands },
        { name: COMBO, icon: "🔥", upgrades: combo },
        { name: "Effect emojis", icon: "✨", upgrades: effectEmojis },
        ...buildingData.map(building => ({
            name: building.name,
            icon: iconOf(building.name),
            upgrades: upgradeData.filter(u => u.building === building.name && !ownSection(u)).sort(byPrice),
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
        case "Emojis earned": return `Earn ${formatNumber(EFFECT_EMOJI_UNLOCK_EARNED[upgrade.tier], 0)} emojis`;
    }
}

const stateLabel: Record<UpgradeState, string> = { owned: "✓ OWNED", forSale: "FOR SALE", locked: "🔒 LOCKED" };

/** Every upgrade in the game, grouped and marked owned / for sale / locked */
export default function UpgradeCatalogue() {
    const { owned, unlocked } = useSelector((state: RootState) => state.upgrades);
    const [filter, setFilter] = useState<Filter>("all");
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [gridWidth, setGridWidth] = useState(0);

    // Joined, so the selector only changes when a building unlocks
    const unlockedBuildings = useSelector((state: RootState) =>
        state.buildings.buildings.filter(b => b.unlocked).map(b => b.name).join("|"));

    const sections = useMemo(buildSections, []);
    const stateOf = (upgrade: UpgradeType): UpgradeState =>
        owned.includes(upgrade.id!) ? "owned" : unlocked.includes(upgrade.id!) ? "forSale" : "locked";

    // Locked upgrades, and sections for buildings or features not found yet, stay hidden:
    // they'd give away what's still to come. The Big Emoji is there from the start
    const isRevealed = (section: Section) =>
        section.name === "Big emoji"
        || unlockedBuildings.split("|").includes(section.name)
        || section.upgrades.some(u => stateOf(u) !== "locked");

    const total = upgradeData.length;
    const counts = { owned: 0, forSale: 0, locked: 0 };
    upgradeData.forEach(upgrade => counts[stateOf(upgrade)]++);
    const percentage = total > 0 ? (counts.owned / total) * 100 : 0;

    const { tileSize, rowWidth } = tileGrid(gridWidth, COLUMNS, GAP);

    // Every upgrade the filter shows, in the order the grid shows them, for stepping through in the modal
    const matches = (upgrade: UpgradeType) => filter === "all" || stateOf(upgrade) === filter;
    const browsable = sections.flatMap(section => section.upgrades.filter(matches));
    const selectedIndex = browsable.findIndex(u => u.id === selectedId);
    const selected = selectedIndex >= 0 ? browsable[selectedIndex] : undefined;
    const prev = selectedIndex > 0 ? browsable[selectedIndex - 1] : undefined;
    const next = selectedIndex >= 0 && selectedIndex < browsable.length - 1 ? browsable[selectedIndex + 1] : undefined;
    const close = () => setSelectedId(undefined);

    // The tiles are sized from the width, so nothing shows until it's measured: a spinner
    // instead of headers whose emojis pop in later
    const measure = (e: LayoutChangeEvent) => setGridWidth(e.nativeEvent.layout.width - PADDING * 2);
    if (tileSize === 0) {
        return (
            <View style={styles.loading} onLayout={measure}>
                <ActivityIndicator size="large" color={palette.sun} accessibilityLabel="Loading upgrades" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.content} onLayout={measure}>
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
                const shown = section.upgrades.filter(matches);
                if (shown.length === 0) return null;
                const ownedHere = section.upgrades.filter(u => stateOf(u) === "owned").length;
                const revealed = isRevealed(section);

                return (
                    <View key={section.name} style={styles.section}>
                        <View style={styles.sectionHead}>
                            <View style={styles.sectionIcon}>
                                <Text size={20} style={{ lineHeight: 26, opacity: revealed ? 1 : 0.5 }}>{revealed ? section.icon : "❔"}</Text>
                            </View>
                            <View style={{ flex: 1, gap: 4 }}>
                                <Text size={16} numberOfLines={1} color={revealed ? undefined : palette.lilac}>{revealed ? section.name : "???"}</Text>
                                <View style={styles.miniTrack}>
                                    <View style={[styles.miniFill, { width: `${(ownedHere / section.upgrades.length) * 100}%` }]} />
                                </View>
                            </View>
                            <Text font="black" size={13} color={palette.lilac}>{ownedHere}/{section.upgrades.length}</Text>
                        </View>

                        <View style={[styles.grid, { width: rowWidth }]}>
                            {shown.map(upgrade => {
                                const state = stateOf(upgrade);
                                const isSelected = upgrade.id === selectedId;
                                return (
                                    <Pressable
                                        key={upgrade.id}
                                        onPress={() => setSelectedId(upgrade.id)}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: isSelected }}
                                        accessibilityLabel={state === "locked" ? "Locked upgrade" : `${upgrade.name}, ${stateLabel[state].replace(/[^A-Z ]/g, "").trim().toLowerCase()}`}
                                        style={[
                                            styles.tile,
                                            { width: tileSize, height: tileSize },
                                            state === "owned" ? styles.tileOwned : state === "forSale" ? styles.tileForSale : styles.tileLocked,
                                            isSelected ? styles.tileSelected : null,
                                        ]}
                                    >
                                        {state === "locked" ? (
                                            <Text size={Math.min(20, tileSize * 0.3)} style={{ opacity: 0.35 }}>🔒</Text>
                                        ) : (
                                            <Text size={Math.min(30, tileSize * 0.44)}>{upgrade.icon}</Text>
                                        )}
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

                    </View>
                );
            })}

            <Modal modalVisible={selected !== undefined} onRequestClose={close}>
                {selected && (
                    <View style={styles.modalCard}>
                        {stateOf(selected) === "locked" ? (
                            <LockedDetail
                                upgrade={selected}
                                revealed={isRevealed(sections.find(s => s.upgrades.includes(selected))!)}
                            />
                        ) : (
                            <UpgradeDetail upgrade={selected} state={stateOf(selected)} />
                        )}
                        <View style={styles.nav}>
                            <NavButton label="Prev" icon={prev && (stateOf(prev) === "locked" ? "🔒" : prev.icon)} direction="prev" onPress={prev ? () => setSelectedId(prev.id) : undefined} />
                            <Text font="black" size={12} color={palette.muted}>{selectedIndex + 1} / {browsable.length}</Text>
                            <NavButton label="Next" icon={next && (stateOf(next) === "locked" ? "🔒" : next.icon)} direction="next" onPress={next ? () => setSelectedId(next.id) : undefined} />
                        </View>
                        <ArrowKeys
                            onPrev={prev ? () => setSelectedId(prev.id) : undefined}
                            onNext={next ? () => setSelectedId(next.id) : undefined}
                            onClose={close}
                        />
                    </View>
                )}
            </Modal>
        </ScrollView>
    );
}

/** Steps to the previous or next upgrade; greyed out at either end */
function NavButton({ label, icon, direction, onPress }: { label: string, icon?: string, direction: "prev" | "next", onPress?: () => void }) {
    const disabled = !onPress;
    const arrow = direction === "prev" ? "‹" : "›";
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`${label} upgrade`}
            accessibilityState={{ disabled }}
            style={({ pressed }) => [styles.navButton, disabled ? styles.navButtonDisabled : null, pressed ? { opacity: 0.7 } : null]}
        >
            {direction === "next" && <Text font="black" size={14} color={disabled ? palette.muted : palette.ink}>{label}</Text>}
            {direction === "prev" && <Text font="black" size={20} color={disabled ? palette.muted : palette.ink} style={styles.navArrow}>{arrow}</Text>}
            {icon ? <Text size={18} style={{ lineHeight: 24 }}>{icon}</Text> : null}
            {direction === "next" && <Text font="black" size={20} color={disabled ? palette.muted : palette.ink} style={styles.navArrow}>{arrow}</Text>}
            {direction === "prev" && <Text font="black" size={14} color={disabled ? palette.muted : palette.ink}>{label}</Text>}
        </Pressable>
    );
}

/** On the web, ← and → step through the upgrades and Escape closes the modal */
function ArrowKeys({ onPrev, onNext, onClose }: { onPrev?: () => void, onNext?: () => void, onClose: () => void }) {
    useEffect(() => {
        if (Platform.OS !== "web") return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") onPrev?.();
            else if (event.key === "ArrowRight") onNext?.();
            else if (event.key === "Escape") onClose();
            else return;
            event.preventDefault();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onPrev, onNext, onClose]);
    return null;
}

/**
 * A locked upgrade: no name, icon or effect. What unlocks it is shown only once its
 * building or feature has been found, so it gives nothing new away
 */
function LockedDetail({ upgrade, revealed }: { upgrade: UpgradeType, revealed: boolean }) {
    return (
        <View style={styles.detail}>
            <View style={styles.detailHead}>
                <View style={styles.detailTile}>
                    <Text size={32} style={{ lineHeight: 40, opacity: 0.5 }}>🔒</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.detailTags}>
                        <View style={styles.tag}>
                            <Text font="black" size={10} color={palette.muted}>{stateLabel.locked}</Text>
                        </View>
                    </View>
                    <Text size={19} color={palette.muted} style={{ lineHeight: 22 }}>???</Text>
                </View>
            </View>
            <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                {revealed ? `Unlocks: ${unlockText(upgrade)}.` : "Keep playing to unlock it."}
            </Text>
        </View>
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

const styles = themedStyles(() => StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        paddingHorizontal: PADDING,
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
        alignSelf: "center",
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
    modalCard: {
        alignSelf: "stretch",
        maxWidth: 420,
        width: "100%",
        marginHorizontal: "auto",
        gap: 12,
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    detail: {
        gap: 10,
    },
    nav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: palette.track,
    },
    navButton: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        borderRadius: radii.md,
        backgroundColor: palette.tile,
    },
    navButtonDisabled: {
        opacity: 0.45,
    },
    navArrow: {
        lineHeight: 22,
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
}));
