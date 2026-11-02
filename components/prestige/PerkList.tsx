import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { purchasePerk } from "../../scripts/game/prestige/prestige";
import { perks, Perk, MAX_PERK_TIER, hasPerk } from "../../scripts/game/prestige/perks";
import { formatNumber } from "../../scripts/misc";
import { getPerkName, getPerkDescription } from "../../i18n/content";
import i18n, { getLanguage } from "../../i18n";
import Text from "../generalUI/Text";
import ChunkyButton from "../generalUI/ChunkyButton";
import { palette, radii, themedStyles } from "../misc/theme";
import { toCaps } from "../../scripts/utils";

const ordinal = (n: number) => i18n.t("prestige.ordinal", { count: n, ordinal: true });
const upper = (text: string) => text.toLocaleUpperCase(getLanguage());

/** Every perk, a tier per prestige, to buy with essence */
export default function PerkList() {
    const { t } = useTranslation();
    const { emojiEssence, prestiges, perks: owned } = useSelector((state: RootState) => state.prestige);
    return (
        <View style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
                <View style={styles.rowBetween}>
                    <Text size={20}>{t("perks.title")}</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{t("perks.ownedCount", { owned: owned.length, total: perks.length })}</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac}>
                    {hasPerk("overflow") ? t("perks.spentKeepsHalf") : t("perks.spentNoBonus")}
                </Text>
            </View>
            {Array.from({ length: MAX_PERK_TIER }, (_, i) => i + 1).map(tier => (
                <PerkTier key={tier} tier={tier} unlocked={prestiges >= tier} essence={emojiEssence} owned={owned} />
            ))}
        </View>
    );
}

function PerkTier({ tier, unlocked, essence, owned }: { tier: number, unlocked: boolean, essence: number, owned: string[] }) {
    const { t } = useTranslation();
    return (
        <View style={styles.tier}>
            <Text font="black" size={11} color={unlocked ? palette.sun : palette.lilac} style={styles.caps}>
                {unlocked ? toCaps(t("perks.tierCaps", { tier })) : toCaps(t("perks.tierLockedCaps", { tier, ordinal: upper(ordinal(tier)) }))}
            </Text>
            {perks.filter(perk => perk.tier === tier).map(perk => (
                <PerkCard key={perk.id} perk={perk} unlocked={unlocked} essence={essence} owned={owned} />
            ))}
        </View>
    );
}

function PerkCard({ perk, unlocked, essence, owned }: { perk: Perk, unlocked: boolean, essence: number, owned: string[] }) {
    const isOwned = owned.includes(perk.id);
    const missing = perk.requires && !owned.includes(perk.requires) ? perks.find(p => p.id === perk.requires) : undefined;
    const affordable = essence >= perk.cost;
    const { t } = useTranslation();

    return (
        <View style={[styles.perk, isOwned ? styles.perkOwned : null, !unlocked ? styles.perkLocked : null]}>
            <View style={[styles.perkIcon, isOwned ? { backgroundColor: palette.mint } : null]}>
                <Text size={24} style={{ lineHeight: 30, opacity: unlocked ? 1 : 0.4 }}>{unlocked ? perk.icon : "🔒"}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text size={16} color={unlocked ? palette.ink : "#FFFFFF"}>{unlocked ? getPerkName(perk) : "???"}</Text>
                <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                    {unlocked ? getPerkDescription(perk) : t("perks.hidden")}
                </Text>
                {unlocked && missing && !isOwned ? (
                    <Text font="bold" size={12} color={palette.pop}>{t("perks.needsFirst", { perk: getPerkName(missing) })}</Text>
                ) : null}
            </View>
            {isOwned ? (
                <View style={styles.ownedTag}>
                    <Text font="black" size={12} color={palette.greenText}>{toCaps(t("perks.ownedTag"))}</Text>
                </View>
            ) : unlocked ? (
                <ChunkyButton
                    width={84}
                    height={40}
                    labelSize={15}
                    label={`✨ ${formatNumber(perk.cost)}`}
                    accessibilityLabel={t("perks.buyLabel", { perk: getPerkName(perk), cost: perk.cost })}
                    disabled={!affordable || !!missing}
                    onPress={() => purchasePerk(perk.id)}
                />
            ) : null}
        </View>
    );
}

export const styles = themedStyles(() => StyleSheet.create({
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
    },
    caps: {
        letterSpacing: 1.2,
    },
    tier: {
        gap: 8,
    },
    perk: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    perkOwned: {
        borderWidth: 2,
        borderColor: palette.green,
    },
    perkLocked: {
        backgroundColor: palette.glass,
    },
    perkIcon: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    ownedTag: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: radii.sm,
        backgroundColor: palette.mint,
    },
}));
