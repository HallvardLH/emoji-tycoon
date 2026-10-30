import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";
import { palette, radii, themedStyles } from "../misc/theme";
import { useSampledSelector } from "../gameUI/useBank";
import { useTranslation } from "react-i18next";
import { getLanguage } from "../../i18n";
import { getBuildingName } from "../../i18n/content";

export default function StatsList() {
    // Stats change every tick and tap; twice a second is plenty for reading them
    const { bigEmojiTaps, emojisEarnedFromTap, effectEmojisCollected, emojisGained, shinyEmojisTapped, comboTaps, bestCombo, buildingEmojis } = useSampledSelector((state: RootState) => state.stats);
    const { funValue } = useSelector((state: RootState) => state.values);
    const buildings = useSelector((state: RootState) => state.buildings.buildings);
    const { t } = useTranslation();

    // What each building has made in total, with buffs, biggest first; ones that made nothing are left out
    const buildingRows: [string, string, string][] = buildings
        .map(building => ({ building, made: buildingEmojis?.[building.buildingId] ?? 0 }))
        .filter(({ made }) => made >= 1)
        .sort((a, b) => b.made - a.made)
        .map(({ building, made }) => [building.icon, getBuildingName(building.buildingId), made < 1e6 ? formatNumber(Math.floor(made)) : formatNumber(made, 1)]);

    const rows: [string, string, string][] = [
        ["✍️", t("stats.totalEmojisDrawn"), formatNumber(emojisGained, 0)],
        ["👆", t("stats.emojiTaps"), formatNumber(bigEmojiTaps)],
        ["💥", t("stats.emojisEarnedFromTapping"), formatNumber(emojisEarnedFromTap)],
        ["✨", t("stats.magicalEmojisTapped"), formatNumber(effectEmojisCollected)],
        ["✨", t("stats.shinyEmojisTapped"), formatNumber(shinyEmojisTapped ?? 0)],
        ["🔥", t("stats.comboTaps"), formatNumber(comboTaps ?? 0, 0)],
        ["🥁", t("stats.bestCombo"), `×${bestCombo ?? 1}`],
    ];
    // The fun value, deliberately unexplained: players who know about it will recognise it
    rows.push(["🔮", "???", funValue == 100 ? `${funValue} 😭` : String(funValue)]);

    return (
        <>
            <StatsCard rows={rows} />
            {buildingRows.length > 0 && (
                <>
                    <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{t("stats.madeByEachBuilding").toLocaleUpperCase(getLanguage())}</Text>
                    <StatsCard rows={buildingRows} />
                </>
            )}
        </>
    )
}

function StatsCard({ rows }: { rows: [string, string, string][] }) {
    return (
        <View style={styles.card}>
            {rows.map(([icon, label, value], index) => (
                <View key={label} style={[styles.row, index > 0 ? styles.divider : null]}>
                    <View style={styles.icon}><Text size={18} style={{ lineHeight: 24 }}>{icon}</Text></View>
                    <Text font="bold" size={14} color={palette.muted} style={styles.label}>{label}</Text>
                    <Text size={18} color={palette.ink}>{value}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: palette.track,
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        flex: 1,
    },
    sectionTitle: {
        marginHorizontal: 20,
        marginTop: 22,
        letterSpacing: 1.3,
    },
}))
