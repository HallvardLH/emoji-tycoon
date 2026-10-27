import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../generalUI/Text";
import ChunkyButton from "../../generalUI/ChunkyButton";
import { palette, radii, themedStyles } from "../../misc/theme";
import { useTranslation } from "react-i18next";
import { toCaps } from "../../../scripts/utils";
import GemButton from "../../gems/GemButton";
import { GemBuyResult } from "../../../scripts/game/gems/gemShop";

interface BuildingListItemProps {
    /** The displayed, translated, name */
    name: string;
    /** The displayed name for the amount being bought, e.g. "Farms" when buying 10 */
    buyName: string;
    icon: string;
    description: string;
    /** Formatted price of the next purchase */
    price: string;
    amount: number;
    /** Formatted emojis per second this building makes, e.g. "7.5" */
    eps: string;
    /** Share of total production, e.g. "1.4%" */
    share: string;
    /** Emojis per second one more of these would add, for buildings you don't own yet */
    epsEach: string;
    /** Building amounts the next upgrade is worked towards between: from the last one's, to where it unlocks */
    nextUpgrade?: { from: number, at: number };
    buyCount: number;
    affordable: boolean;
    /** Shown under the price on a disabled button, e.g. "IN 3 MIN" */
    waitLabel: string;
    onPress: () => void;
    /** Gems to buy it now while it's not affordable (see gemShop.ts) */
    gemPrice?: number;
    onGemBuy?: () => GemBuyResult;
}

function BuildingListItem(props: BuildingListItemProps) {
    const { name, buyName, icon, description, price, amount, eps, share, epsEach, nextUpgrade, buyCount, affordable, waitLabel, onPress, gemPrice, onGemBuy } = props;
    const { t } = useTranslation();

    const owned = amount > 0;
    // Starts over for each upgrade, from where the last one unlocked
    const progress = nextUpgrade
        ? Math.min(1, Math.max(0, (amount - nextUpgrade.from) / (nextUpgrade.at - nextUpgrade.from)))
        : 1;

    return (
        <View style={styles.card}>
            <View style={styles.tile}>
                <Text size={32} style={styles.tileEmoji}>{icon}</Text>
            </View>

            <View style={styles.center}>
                <View style={styles.titleRow}>
                    <Text size={17} color={palette.ink} numberOfLines={1} style={styles.name}>{name}</Text>
                    {owned ? (
                        <View style={styles.ownedBadge} accessibilityLabel={t("buildings.ownedA11y", { count: amount })}>
                            <Text font="black" size={12} color="#FFFFFF">{amount}</Text>
                        </View>
                    ) : (
                        <View style={styles.newBadge}>
                            <Text font="black" size={11} color="#FFFFFF">{toCaps(t("buildings.newBadge"))}</Text>
                        </View>
                    )}
                </View>

                {/* Always two lines tall, so every card is the same height */}
                <Text font="body" size={12} color={palette.muted} numberOfLines={2} style={styles.description}>{description}</Text>

                {owned ? (
                    <>
                        <Text font="bold" size={11} color={palette.muted} numberOfLines={1} style={styles.statLine}>{t("buildings.statLine", { eps, share })}</Text>
                        <View style={styles.progressRow}>
                            <View style={styles.track}>
                                <View style={[styles.fill, { width: `${progress * 100}%` }]} />
                            </View>
                            <Text font="bold" size={11} color={palette.muted} numberOfLines={1} style={styles.statLine}>
                                {nextUpgrade ? t("buildings.nextUpgrade", { at: nextUpgrade.at }) : t("buildings.allUpgradesFound")}
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        <Text font="bold" size={11} color={palette.muted} numberOfLines={1} style={styles.statLine}>{t("buildings.epsEach", { eps: epsEach })}</Text>
                        {/* Where the progress row goes once owned */}
                        <View style={styles.progressRow} />
                    </>
                )}
            </View>

            <View style={styles.buy}>
                <ChunkyButton
                    width={96}
                    label={price}
                    labelSize={price.length > 7 ? 13 : 16}
                    sublabel={affordable ? (buyCount > 1 ? toCaps(t("buildings.buyCount", { count: buyCount })) : toCaps(t("buildings.buy"))) : waitLabel}
                    accessibilityLabel={t("buildings.buyA11y", { count: buyCount, name: buyName, price })}
                    disabled={!affordable}
                    onPress={onPress}
                />
                {/* Not affordable yet: skip the wait with gems */}
                {!affordable && gemPrice !== undefined && onGemBuy && (
                    <GemButton compact cost={gemPrice} onBuy={onGemBuy} accessibilityLabel={t("buildings.buyNowA11y", { name: buyName })} style={{ width: 96 }} />
                )}
            </View>
        </View>
    )
}

/** The next locked building, teased as a silhouette */
export function MysteryBuildingItem({ revealAt }: { revealAt: string }) {
    const { t } = useTranslation();
    return (
        <View style={styles.mystery}>
            <View style={[styles.tile, styles.mysteryTile]}>
                <Text size={28} color={palette.lilac}>?</Text>
            </View>
            <View style={styles.center}>
                <Text size={17} color={palette.lilacLight}>{t("buildings.mystery")}</Text>
                <Text font="body" size={12} color={palette.lilac}>{t("buildings.revealsAt", { amount: revealAt })}</Text>
            </View>
        </View>
    );
}

// Every card is this tall, whatever it shows, so the list doesn't jump as buildings are bought
const CARD_HEIGHT = 113;

const styles = themedStyles(() => StyleSheet.create({
    buy: {
        alignItems: "center",
        gap: 4,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: CARD_HEIGHT,
        paddingHorizontal: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    tile: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    tileEmoji: {
        lineHeight: 40,
    },
    center: {
        flex: 1,
        minWidth: 0,
        gap: 3,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        flexShrink: 1,
        lineHeight: 22,
    },
    ownedBadge: {
        paddingHorizontal: 7,
        paddingVertical: 1,
        borderRadius: 8,
        backgroundColor: palette.ink,
    },
    newBadge: {
        paddingHorizontal: 7,
        paddingVertical: 1,
        borderRadius: 8,
        backgroundColor: palette.pop,
    },
    description: {
        lineHeight: 16,
        height: 32,
    },
    statLine: {
        lineHeight: 14,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 14,
    },
    track: {
        flex: 1,
        height: 5,
        borderRadius: 5,
        backgroundColor: palette.track,
        overflow: "hidden",
    },
    fill: {
        height: 5,
        borderRadius: 5,
        backgroundColor: palette.violet,
    },
    mystery: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: CARD_HEIGHT,
        paddingHorizontal: 12,
        borderRadius: radii.lg,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "rgba(255,255,255,0.22)",
    },
    mysteryTile: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
}))

/**
 * Rows re-render only when what they show changes. The list re-renders twice a second
 * (the bank sample) and makes a new onPress and nextUpgrade each time; onPress always
 * buys the same building, so it's left out, and nextUpgrade is compared by value.
 */
export default memo(BuildingListItem, (prev, next) => {
    for (const key of Object.keys(next) as (keyof BuildingListItemProps)[]) {
        if (key === "onPress" || key === "onGemBuy") continue;
        if (key === "nextUpgrade") {
            if (prev.nextUpgrade?.from !== next.nextUpgrade?.from || prev.nextUpgrade?.at !== next.nextUpgrade?.at) return false;
            continue;
        }
        if (prev[key] !== next[key]) return false;
    }
    return true;
});
