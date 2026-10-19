import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../scripts/redux/reduxStore";
import { GEM_PACKS, GemPack } from "../scripts/game/gemPacks";
import { GEM_COST, GEM_MULTIPLIER } from "../scripts/game/offline";
import { buyGemPack, setGemStoreOpen } from "../scripts/monetization";
import { loadProducts } from "../scripts/purchases";
import { celebrateMilestone } from "../scripts/game/milestones";
import { formatNumber } from "../scripts/misc";
import Text from "../components/generalUI/Text";
import ChunkyButton from "../components/generalUI/ChunkyButton";
import { palette, radii } from "../components/misc/theme";

/** The gem store: gem packs bought for real money */
export default function GemStoreScreen() {
    const router = useRouter();
    const gems = useSelector((state: RootState) => state.gems.gems);
    // Prices in the player's currency by pack id; null when the store can't be reached
    const [prices, setPrices] = useState<Record<string, string> | null | undefined>(undefined);
    // The pack whose payment is going through, so only one is bought at a time
    const [buying, setBuying] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    // Keeps the welcome back screen out of the way meanwhile
    useEffect(() => {
        setGemStoreOpen(true);
        return () => setGemStoreOpen(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        loadProducts(GEM_PACKS.map(pack => pack.id)).then(loaded => { if (!cancelled) setPrices(loaded); });
        return () => { cancelled = true; };
    }, []);

    const buy = async (pack: GemPack) => {
        if (buying) return;
        setBuying(pack.id);
        setFailed(false);
        try {
            const result = await buyGemPack(pack);
            if (result === "bought") {
                celebrateMilestone({ icon: pack.icon, caption: "THANK YOU!", title: `+${formatNumber(pack.gems)} gems` });
            } else if (result === "failed") {
                setFailed(true);
            }
        } finally {
            setBuying(null);
        }
    };

    return (
        <View style={styles.screen}>
            <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
            <SafeAreaView edges={["top"]} style={styles.topBar}>
                <Text size={30} style={{ lineHeight: 44 }}>Gem store</Text>
                <Pressable
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    style={({ pressed }) => [styles.close, pressed ? { opacity: 0.7 } : null]}
                >
                    <Text size={20} style={{ lineHeight: 24 }}>✕</Text>
                </Pressable>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Gems held, and what they're for */}
                <View style={styles.hero}>
                    <Text size={44} style={{ lineHeight: 52 }}>💎</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text font="black" size={11} color={palette.muted} style={styles.caps}>YOUR GEMS</Text>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{formatNumber(gems)}</Text>
                        <Text font="bold" size={13} color={palette.greenText}>
                            {GEM_COST} gems claim ×{GEM_MULTIPLIER} offline earnings
                        </Text>
                    </View>
                </View>

                {prices === null ? (
                    <View style={styles.notice}>
                        <Text font="bold" size={14} color={palette.muted} style={styles.center}>
                            The store isn't available right now. Check your connection and try again later.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {GEM_PACKS.map(pack => (
                            <PackCard
                                key={pack.id}
                                pack={pack}
                                price={prices?.[pack.id]}
                                loading={prices === undefined}
                                buying={buying === pack.id}
                                disabled={!!buying}
                                onBuy={() => buy(pack)}
                            />
                        ))}
                    </View>
                )}

                {failed ? (
                    <Text font="bold" size={13} color={palette.pop} style={styles.center}>
                        The purchase didn't go through. You haven't been charged.
                    </Text>
                ) : null}
                <Text font="bold" size={12} color={palette.lilac} style={styles.center}>
                    Gems are kept when you prestige.
                </Text>
            </ScrollView>
        </View>
    );
}

interface PackCardProps {
    pack: GemPack;
    /** In the player's currency. Missing when the store doesn't have the pack */
    price?: string;
    loading: boolean;
    buying: boolean;
    disabled: boolean;
    onBuy: () => void;
}

function PackCard({ pack, price, loading, buying, disabled, onBuy }: PackCardProps) {
    const available = !!price;
    return (
        <View style={[styles.pack, pack.tag ? styles.packTagged : null]}>
            {pack.tag ? (
                <View style={styles.tag}>
                    <Text font="black" size={10} color={palette.ink} style={styles.caps}>{pack.tag}</Text>
                </View>
            ) : null}
            <Text size={40} style={{ lineHeight: 48 }}>{pack.icon}</Text>
            <Text size={24} color={palette.ink} style={{ lineHeight: 28 }}>{formatNumber(pack.gems)}</Text>
            <Text font="black" size={11} color={palette.muted} style={styles.caps}>GEMS</Text>
            <ChunkyButton
                height={44}
                labelSize={16}
                width="100%"
                label={buying ? "…" : loading ? pack.fallbackPrice : price ?? "Unavailable"}
                disabled={disabled || loading || !available}
                accessibilityLabel={`Buy ${formatNumber(pack.gems)} gems${price ? ` for ${price}` : ""}`}
                onPress={onBuy}
                style={{ marginTop: 6 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.grape,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    close: {
        width: 44,
        height: 44,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
        gap: 16,
        // Stays a column of two on wide screens
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
    caps: {
        letterSpacing: 1.2,
    },
    center: {
        textAlign: "center",
    },
    hero: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    notice: {
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    pack: {
        // Two to a row
        flexBasis: "45%",
        flexGrow: 1,
        alignItems: "center",
        paddingTop: 18,
        paddingBottom: 14,
        paddingHorizontal: 12,
        borderRadius: radii.xl,
        // Same size as the tagged ones
        borderWidth: 3,
        borderColor: "transparent",
        backgroundColor: palette.paper,
    },
    packTagged: {
        borderColor: palette.sun,
    },
    tag: {
        position: "absolute",
        top: -11,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: radii.pill,
        backgroundColor: palette.sun,
    },
});
