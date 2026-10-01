import { StyleSheet, View } from "react-native";
import Text from "../../generalUI/Text";
import ChunkyButton from "../../generalUI/ChunkyButton";
import { palette, radii } from "../../misc/theme";

interface BuildingListItemProps {
    name: string;
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
    /** Building amount where the next upgrade unlocks */
    nextUpgradeAt?: number;
    buyCount: number;
    affordable: boolean;
    /** Shown under the price on a disabled button, e.g. "IN 3 MIN" */
    waitLabel: string;
    onPress: () => void;
}

export default function BuildingListItem(props: BuildingListItemProps) {
    const { name, icon, description, price, amount, eps, share, epsEach, nextUpgradeAt, buyCount, affordable, waitLabel, onPress } = props;

    const owned = amount > 0;
    const progress = nextUpgradeAt ? Math.min(1, amount / nextUpgradeAt) : 1;

    return (
        <View style={styles.card}>
            <View style={styles.tile}>
                <Text size={32} style={styles.tileEmoji}>{icon}</Text>
            </View>

            <View style={styles.center}>
                <View style={styles.titleRow}>
                    <Text size={17} color={palette.ink} numberOfLines={1} style={styles.name}>{name}</Text>
                    {owned ? (
                        <View style={styles.ownedBadge} accessibilityLabel={`${amount} owned`}>
                            <Text font="black" size={12} color="#FFFFFF">{amount}</Text>
                        </View>
                    ) : (
                        <View style={styles.newBadge}>
                            <Text font="black" size={11} color="#FFFFFF">NEW</Text>
                        </View>
                    )}
                </View>

                <Text font="body" size={12} color={palette.muted} numberOfLines={2}>{description}</Text>

                {owned ? (
                    <>
                        <Text font="bold" size={11} color={palette.muted}>{eps} /sec · {share} of total</Text>
                        <View style={styles.progressRow}>
                            <View style={styles.track}>
                                <View style={[styles.fill, { width: `${progress * 100}%` }]} />
                            </View>
                            <Text font="bold" size={11} color={palette.muted}>
                                {nextUpgradeAt ? `next upgrade ${nextUpgradeAt}` : "all upgrades found"}
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text font="bold" size={11} color={palette.muted}>+{epsEach} /sec each</Text>
                )}
            </View>

            <ChunkyButton
                width={96}
                label={price}
                labelSize={price.length > 7 ? 13 : 16}
                sublabel={affordable ? (buyCount > 1 ? `BUY ×${buyCount}` : "BUY") : waitLabel}
                accessibilityLabel={`Buy ${buyCount} ${name} for ${price}`}
                disabled={!affordable}
                onPress={onPress}
            />
        </View>
    )
}

/** The next locked building, teased as a silhouette */
export function MysteryBuildingItem({ revealAt }: { revealAt: string }) {
    return (
        <View style={styles.mystery}>
            <View style={[styles.tile, styles.mysteryTile]}>
                <Text size={28} color={palette.lilac}>?</Text>
            </View>
            <View style={styles.center}>
                <Text size={17} color={palette.lilacLight}>Mystery building</Text>
                <Text font="body" size={12} color={palette.lilac}>Reveals at {revealAt} emojis</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
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
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
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
        padding: 12,
        borderRadius: radii.lg,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "rgba(255,255,255,0.22)",
    },
    mysteryTile: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },
})
