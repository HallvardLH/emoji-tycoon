import { useMemo, useState } from "react";
import { View, FlatList, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Text from "../generalUI/Text";
import { RootState } from "../../scripts/redux/reduxStore";
import { CollectionState } from "../../scripts/redux/collectionSlice";
import { emojiCategories } from "../../scripts/game/collection/emojiCategories";
import { effectEmojis } from "../../scripts/game/effects/effectData";
import { palette, radii } from "../misc/theme";

const categoryInfo: Record<string, { label: string, icon: string }> = {
    faces: { label: "Faces", icon: "😀" },
    animals: { label: "Animals", icon: "🐙" },
    food: { label: "Food", icon: "🌮" },
    objects: { label: "Objects", icon: "⚽" },
    people: { label: "People", icon: "🧑" },
    bodyParts: { label: "Body", icon: "💪" },
    placesBuildings: { label: "Places", icon: "🏠" },
    plants: { label: "Plants", icon: "🌷" },
    vehicles: { label: "Vehicles", icon: "🚗" },
    weather: { label: "Weather", icon: "⛅" },
    symbols: { label: "Symbols", icon: "💯" },
};

const COLUMNS = 6;

type Cell = { key: string, emoji?: string, count: number, shiny?: number };

export default function CollectionList() {
    const collection = useSelector((state: RootState) => state.collection);
    const [category, setCategory] = useState("faces");

    // Every collectible emoji per category (effect emojis never show up on the Big Emoji)
    const categories = useMemo(() => Object.keys(categoryInfo).map(name => {
        const counts = collection[name as keyof CollectionState] ?? [];
        const cells: Cell[] = emojiCategories[name]
            .map((emoji, index) => ({ key: `${name}-${index}`, emoji, count: counts[index]?.amount ?? 0, shiny: counts[index]?.shiny ?? 0 }))
            .filter(cell => !effectEmojis.includes(cell.emoji));
        return { name, cells, found: cells.filter(cell => cell.count > 0).length };
    }), [collection]);

    const totalFound = categories.reduce((sum, c) => sum + c.found, 0);
    const shinyFound = categories.reduce((sum, c) => sum + c.cells.filter(cell => (cell.shiny ?? 0) > 0).length, 0);
    const total = categories.reduce((sum, c) => sum + c.cells.length, 0);
    const percentage = total > 0 ? (totalFound / total) * 100 : 0;
    const mostTapped = categories
        .flatMap(c => c.cells)
        .reduce<Cell | undefined>((best, cell) => cell.count > (best?.count ?? 0) ? cell : best, undefined);

    const active = categories.find(c => c.name === category) ?? categories[0];
    // Pad the last row so every cell keeps the same width
    const cells = [...active.cells];
    while (cells.length % COLUMNS !== 0) cells.push({ key: `pad-${cells.length}`, count: -1 });

    const header = (
        <View style={styles.header}>
            <View style={styles.progressCard}>
                <View style={styles.progressTop}>
                    <View style={styles.progressCount}>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{totalFound.toLocaleString("en-US")}</Text>
                        <Text font="bold" size={15} color={palette.muted}>/ {total.toLocaleString("en-US")} found</Text>
                    </View>
                    <Text size={17} color={palette.violetDeep}>{Math.floor(percentage)}%</Text>
                </View>
                <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.max(percentage, totalFound > 0 ? 1 : 0)}%` }]} />
                </View>
                <Text font="body" size={12} color={palette.muted}>
                    {mostTapped ? `Most tapped: ${mostTapped.emoji} ×${mostTapped.count}` : "Tap the Big Emoji to start collecting"}
                    {shinyFound > 0 ? `  ·  ✨ ${shinyFound} shiny` : ""}
                </Text>
            </View>

            <View style={styles.chips}>
                {categories.map(c => {
                    const selected = c.name === active.name;
                    const info = categoryInfo[c.name];
                    return (
                        <Pressable
                            key={c.name}
                            onPress={() => setCategory(c.name)}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            accessibilityLabel={`${info.label}, ${c.found} of ${c.cells.length} found`}
                            style={[styles.chip, selected ? styles.chipActive : null]}
                        >
                            <Text font={selected ? "black" : "bold"} size={13} color={selected ? palette.ink : "#FFFFFF"}>
                                {info.icon} {info.label} {c.found}/{c.cells.length}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );

    return (
        <FlatList
            key={active.name}
            data={cells}
            numColumns={COLUMNS}
            ListHeaderComponent={header}
            keyExtractor={(cell) => cell.key}
            contentContainerStyle={styles.content}
            columnWrapperStyle={styles.row}
            initialNumToRender={48}
            renderItem={({ item }) => {
                if (item.count < 0) return <View style={styles.cellPad} />;
                if (item.count === 0) {
                    return (
                        <View style={styles.missing} accessibilityLabel="Not found yet">
                            <Text size={18} color="rgba(255,255,255,0.3)">?</Text>
                        </View>
                    );
                }
                const shiny = (item.shiny ?? 0) > 0;
                return (
                    <View
                        style={[styles.found, shiny ? styles.foundShiny : null]}
                        accessibilityLabel={`${item.emoji}, tapped ${item.count} times${shiny ? `, ${item.shiny} shiny` : ""}`}
                    >
                        <Text size={28} style={{ lineHeight: 34 }}>{item.emoji}</Text>
                        {shiny && <Text size={13} style={styles.shinyMark}>✨</Text>}
                        <View style={styles.countBadge}>
                            <Text font="black" size={10} color={palette.ink}>{item.count > 99 ? "99+" : item.count}</Text>
                        </View>
                    </View>
                );
            }}
        />
    )
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    header: {
        gap: 14,
        paddingTop: 14,
        paddingBottom: 14,
    },
    progressCard: {
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
        gap: 10,
    },
    progressTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    progressCount: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
    },
    track: {
        height: 10,
        borderRadius: 10,
        backgroundColor: palette.track,
        overflow: "hidden",
    },
    fill: {
        height: 10,
        borderRadius: 10,
        backgroundColor: palette.violet,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        height: 36,
        paddingHorizontal: 12,
        borderRadius: 18,
        backgroundColor: palette.glass,
        justifyContent: "center",
    },
    chipActive: {
        backgroundColor: palette.sun,
    },
    row: {
        gap: 8,
        marginBottom: 8,
    },
    found: {
        flex: 1,
        height: 52,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    foundShiny: {
        backgroundColor: "rgba(255,197,61,0.18)",
        borderWidth: 2,
        borderColor: palette.sun,
    },
    shinyMark: {
        position: "absolute",
        top: -6,
        left: -4,
        lineHeight: 16,
    },
    countBadge: {
        position: "absolute",
        right: -4,
        bottom: -4,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        backgroundColor: palette.paper,
        alignItems: "center",
        justifyContent: "center",
    },
    missing: {
        flex: 1,
        height: 52,
        borderRadius: radii.md,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: palette.glassLine,
        alignItems: "center",
        justifyContent: "center",
    },
    cellPad: {
        flex: 1,
    },
})
