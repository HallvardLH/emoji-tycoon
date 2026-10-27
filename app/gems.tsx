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
import CloseButton from "../components/generalUI/CloseButton";
import { palette, radii, themedStyles } from "../components/misc/theme";
import GemPowers from "../components/gems/GemPowers";
import GemButton from "../components/gems/GemButton";
import { MINUTES_PER_GEM, buyTheme, ownsTheme } from "../scripts/game/gems/gemShop";
import { appThemes, AppTheme } from "../scripts/game/gems/themes";
import { TAP_GEM_EVERY, PRESTIGE_GEMS } from "../scripts/game/gems/gemRewards";

/** A tiny screen in a theme's colours: the stage, a card, an accent button and the tab bar */
function ThemePreview({ theme }: { theme: AppTheme }) {
    const c = theme.colours;
    return (
        <View style={[styles.preview, { backgroundColor: c.grape }]}>
            <View style={[styles.previewGlow, { backgroundColor: c.spotlight }]}>
                <Text size={20} style={{ lineHeight: 26 }}>{theme.icon}</Text>
            </View>
            <View style={[styles.previewCard, { backgroundColor: c.paper }]}>
                <View style={[styles.previewLine, { backgroundColor: c.track }]} />
                <View style={[styles.previewButton, { backgroundColor: c.sun }]} />
            </View>
            <View style={[styles.previewBar, { backgroundColor: c.night }]}>
                <View style={[styles.previewLamp, { backgroundColor: c.sun }]} />
            </View>
        </View>
    );
}

/** Reskins of the whole app: bought once with gems, then switched freely */
function AppThemes() {
    const current = useSelector((state: RootState) => state.gems.theme ?? "classic");
    // Re-render when one is bought
    useSelector((state: RootState) => state.gems.themes);
    return (
        <View style={styles.grid}>
            {appThemes.map(theme => {
                const owned = ownsTheme(theme.id);
                const inUse = current === theme.id;
                return (
                    <View key={theme.id} style={[styles.theme, inUse ? styles.packTagged : null]}>
                        <ThemePreview theme={theme} />
                        <Text size={16} color={palette.ink}>{theme.name}</Text>
                        {inUse ? (
                            <Text font="black" size={12} color={palette.greenText} style={styles.themeAction}>✓ IN USE</Text>
                        ) : owned ? (
                            <Pressable
                                onPress={() => buyTheme(theme.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Use the ${theme.name} theme`}
                                style={({ pressed }) => [styles.useTheme, pressed ? { opacity: 0.8 } : null]}
                            >
                                <Text font="black" size={13} color={palette.ink}>Use</Text>
                            </Pressable>
                        ) : (
                            <GemButton compact cost={theme.price} onBuy={() => buyTheme(theme.id)} accessibilityLabel={`Buy the ${theme.name} theme`} />
                        )}
                    </View>
                );
            })}
        </View>
    );
}

/** The gem store: gem packs bought for real money, and what gems are for */
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
                <CloseButton size={44} onPress={() => router.back()} />
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Gems held, and what they're for */}
                <View style={styles.hero}>
                    <Text size={44} style={{ lineHeight: 52 }}>💎</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text font="black" size={11} color={palette.muted} style={styles.caps}>YOUR GEMS</Text>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{formatNumber(gems)}</Text>
                        <Text font="bold" size={13} color={palette.greenText}>
                            Boosts, time warps, buy now and more
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

                {/* What gems are for */}
                <Text size={22}>Gem powers</Text>
                <GemPowers />
                <View style={styles.notice}>
                    <Text font="bold" size={13} color={palette.muted} style={{ lineHeight: 19 }}>
                        💎 Can't afford a building or upgrade yet? Buy it now with gems, about 1 gem per {MINUTES_PER_GEM} minutes of waiting.{"\n"}
                        🌙 Coming back after a while: {GEM_COST} gems for ×{GEM_MULTIPLIER} offline earnings.
                    </Text>
                </View>

                <Text size={22}>App themes</Text>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8 }}>
                    Reskin the whole game. Buy once, switch any time.
                </Text>
                <AppThemes />

                <Text size={22}>Free gems</Text>
                <View style={styles.notice}>
                    <Text font="bold" size={13} color={palette.muted} style={{ lineHeight: 20 }}>
                        👆 Every {TAP_GEM_EVERY}th tap of the Big Emoji: 1 gem{"\n"}
                        ✨ Every prestige: {PRESTIGE_GEMS} gems
                    </Text>
                </View>
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

const styles = themedStyles(() => StyleSheet.create({
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
    theme: {
        // Three to a row
        flexBasis: "30%",
        flexGrow: 1,
        alignItems: "center",
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: radii.xl,
        borderWidth: 3,
        borderColor: "transparent",
        backgroundColor: palette.paper,
    },
    preview: {
        width: 64,
        height: 86,
        borderRadius: 12,
        overflow: "hidden",
        alignItems: "center",
        paddingTop: 8,
        gap: 5,
    },
    previewGlow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    previewCard: {
        width: 50,
        padding: 4,
        gap: 3,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    previewLine: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    previewButton: {
        width: 14,
        height: 8,
        borderRadius: 3,
    },
    previewBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 14,
        alignItems: "center",
    },
    previewLamp: {
        width: 16,
        height: 2,
        borderRadius: 1,
    },
    themeAction: {
        minHeight: 28,
        lineHeight: 28,
    },
    useTheme: {
        minHeight: 28,
        paddingHorizontal: 16,
        borderRadius: radii.pill,
        backgroundColor: palette.tile,
        justifyContent: "center",
    },
    tag: {
        position: "absolute",
        top: -11,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: radii.pill,
        backgroundColor: palette.sun,
    },
}));
