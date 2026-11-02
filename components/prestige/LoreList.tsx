import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { loreChapters, LoreChapter } from "../../scripts/game/prestige/lore";
import { getLoreTitle, getLoreText } from "../../i18n/content";
import i18n from "../../i18n";
import Text from "../generalUI/Text";
import { palette, radii, themedStyles } from "../misc/theme";
import { toCaps } from "../../scripts/utils";
import { styles as cardStyles } from "./PerkList";

const ordinal = (n: number) => i18n.t("prestige.ordinal", { count: n, ordinal: true });

/** The story so far: the prologue, and a chapter per prestige. Newest first */
export default function LoreList() {
    const { t } = useTranslation();
    const prestiges = useSelector((state: RootState) => state.prestige.prestiges);
    const unlocked = loreChapters.filter(chapter => prestiges >= chapter.id);
    const next = loreChapters.find(chapter => prestiges < chapter.id);

    return (
        <View style={{ gap: 12 }}>
            <View style={cardStyles.rowBetween}>
                <Text size={20}>{t("lore.title")}</Text>
                <Text font="bold" size={12} color={palette.lilac}>{t("lore.chapterCount", { read: unlocked.length, total: loreChapters.length })}</Text>
            </View>
            {next ? (
                <View style={[styles.chapter, styles.locked]}>
                    <Text font="black" size={11} color={palette.lilac} style={cardStyles.caps}>
                        {toCaps(t("lore.chapterCaps", { number: next.id }))}
                    </Text>
                    <Text font="body" size={14} color={palette.lilac}>🔒 {t("lore.unlocksWith", { ordinal: ordinal(next.id) })}</Text>
                </View>
            ) : null}
            {[...unlocked].reverse().map(chapter => <LoreCard key={chapter.id} chapter={chapter} />)}
        </View>
    );
}

export function LoreCard({ chapter }: { chapter: LoreChapter }) {
    const { t } = useTranslation();
    return (
        <View style={styles.chapter}>
            <View style={styles.head}>
                <Text size={28} style={{ lineHeight: 34 }}>{chapter.icon}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text font="black" size={11} color={palette.violetDeep} style={cardStyles.caps}>
                        {toCaps(chapter.id === 0 ? t("lore.prologueCaps") : t("lore.chapterCaps", { number: chapter.id }))}
                    </Text>
                    <Text size={18} color={palette.ink}>{getLoreTitle(chapter)}</Text>
                </View>
            </View>
            <Text font="body" size={15} color={palette.muted} style={{ lineHeight: 22 }}>{getLoreText(chapter)}</Text>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    chapter: {
        padding: 16,
        gap: 10,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    locked: {
        backgroundColor: palette.glass,
        gap: 4,
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
}));
