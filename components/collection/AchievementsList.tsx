import { useMemo, useState } from "react";
import { View, FlatList, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Text from "../generalUI/Text";
import { RootState } from "../../scripts/redux/reduxStore";
import { Achievement, AchievementGroup, achievementGroups, achievements } from "../../scripts/game/achievements";
import { palette, radii } from "../misc/theme";

/** Every achievement by group, unlocked ones in full colour, with overall progress */
export default function AchievementsList() {
    // Changes only when one unlocks
    const unlocked = useSelector((state: RootState) => state.achievements.unlocked);
    const [group, setGroup] = useState<AchievementGroup | "All">("All");

    const unlockedSet = useMemo(() => new Set(unlocked), [unlocked]);
    const total = achievements.length;
    const done = achievements.filter(a => unlockedSet.has(a.id)).length;
    const percentage = total > 0 ? (done / total) * 100 : 0;

    const groups = useMemo(() => achievementGroups.map(({ group, icon }) => {
        const list = achievements.filter(a => a.group === group);
        return { group, icon, total: list.length, done: list.filter(a => unlockedSet.has(a.id)).length };
    }), [unlockedSet]);

    // Unlocked first, then in their order (easiest first)
    const shown = useMemo(() => {
        const list = group === "All" ? achievements : achievements.filter(a => a.group === group);
        return [...list].sort((a, b) => Number(unlockedSet.has(b.id)) - Number(unlockedSet.has(a.id)));
    }, [group, unlockedSet]);

    const header = (
        <View style={styles.header}>
            <View style={styles.progressCard}>
                <View style={styles.progressTop}>
                    <View style={styles.progressCount}>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{done}</Text>
                        <Text font="bold" size={15} color={palette.muted}>/ {total} unlocked</Text>
                    </View>
                    <Text size={17} color={palette.violetDeep}>{Math.floor(percentage)}%</Text>
                </View>
                <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.max(percentage, done > 0 ? 1 : 0)}%` }]} />
                </View>
            </View>

            <View style={styles.chips}>
                <Chip label={`🏅 All ${done}/${total}`} selected={group === "All"} onPress={() => setGroup("All")} />
                {groups.map(g => (
                    <Chip
                        key={g.group}
                        label={`${g.icon} ${g.group} ${g.done}/${g.total}`}
                        selected={group === g.group}
                        onPress={() => setGroup(g.group)}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <FlatList
            key={group}
            data={shown}
            ListHeaderComponent={header}
            keyExtractor={a => a.id}
            contentContainerStyle={styles.content}
            initialNumToRender={20}
            renderItem={({ item }) => <AchievementRow achievement={item} unlocked={unlockedSet.has(item.id)} />}
        />
    );
}

function Chip({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, selected ? styles.chipActive : null]}
        >
            <Text font={selected ? "black" : "bold"} size={13} color={selected ? palette.ink : "#FFFFFF"}>{label}</Text>
        </Pressable>
    );
}

function AchievementRow({ achievement, unlocked }: { achievement: Achievement, unlocked: boolean }) {
    const hidden = achievement.secret && !unlocked;
    return (
        <View
            style={[styles.row, unlocked ? null : styles.rowLocked]}
            accessibilityLabel={hidden
                ? "Secret trophy, not unlocked yet"
                : `${achievement.name}. ${achievement.description}. ${unlocked ? "Unlocked" : "Not unlocked yet"}`}
        >
            <View style={[styles.iconTile, unlocked ? styles.iconTileUnlocked : null]}>
                <Text size={24} style={[{ lineHeight: 30 }, unlocked ? null : styles.iconLocked]}>{hidden ? "❔" : achievement.icon}</Text>
            </View>
            <View style={styles.text}>
                <Text size={16} color={unlocked ? palette.ink : palette.muted} numberOfLines={1}>{hidden ? "???" : achievement.name}</Text>
                <Text font="bold" size={12} color={palette.muted}>{hidden ? "A secret. Keep playing to find it" : achievement.description}</Text>
            </View>
            <Text size={18} style={{ lineHeight: 24 }}>{unlocked ? "✅" : "🔒"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        gap: 8,
    },
    header: {
        gap: 14,
        paddingTop: 14,
        paddingBottom: 6,
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
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    rowLocked: {
        backgroundColor: palette.tile,
    },
    iconTile: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: palette.track,
    },
    iconTileUnlocked: {
        backgroundColor: "rgba(255,197,61,0.3)",
    },
    iconLocked: {
        opacity: 0.35,
    },
    text: {
        flex: 1,
        gap: 2,
    },
});
