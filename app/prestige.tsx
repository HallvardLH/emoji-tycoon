import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../scripts/redux/reduxStore";
import { prestige, purchasePerk, essenceForEmojis, emojisForEssence } from "../scripts/game/prestige/prestige";
import { perks, Perk, MAX_PERK_TIER, essenceBonusPerEssence } from "../scripts/game/prestige/perks";
import { celebrateMilestone } from "../scripts/game/milestones";
import { formatNumber } from "../scripts/misc";
import Text from "../components/generalUI/Text";
import ChunkyButton from "../components/generalUI/ChunkyButton";
import { palette, radii } from "../components/misc/theme";

// How long the "tap again" confirmation stays armed
const CONFIRM_MS = 3000;
const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

/** Emoji essence: prestiging, and the perks it buys */
export default function PrestigeScreen() {
    const router = useRouter();
    const { emojiEssence, totalEssenceEarned, prestiges, perks: owned } = useSelector((state: RootState) => state.prestige);
    // Derived, so the screen doesn't re-render every tick
    const allTimeEssence = useSelector((state: RootState) => essenceForEmojis(state.stats.emojisGained));
    const progress = useSelector((state: RootState) => state.prestige.remainingEmojisPrestigePerc);
    const pending = Math.max(0, allTimeEssence - totalEssenceEarned);
    const bonus = essenceBonusPerEssence();

    // Prestiging wipes the run, so it takes a second tap to confirm
    const [armed, setArmed] = useState(false);
    useEffect(() => {
        if (!armed) return;
        const timeout = setTimeout(() => setArmed(false), CONFIRM_MS);
        return () => clearTimeout(timeout);
    }, [armed]);

    const onPrestige = () => {
        if (!armed) { setArmed(true); return; }
        setArmed(false);
        const gained = prestige();
        if (gained > 0) {
            const tier = Math.min(prestiges + 1, MAX_PERK_TIER);
            celebrateMilestone({
                icon: "✨", caption: `PRESTIGE #${prestiges + 1}`,
                title: prestiges + 1 <= MAX_PERK_TIER ? `+${gained} essence · tier ${tier} perks unlocked` : `+${gained} essence`,
            });
        }
    };

    return (
        <View style={styles.screen}>
            <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
            <SafeAreaView edges={["top"]} style={styles.topBar}>
                <Text size={30} style={{ lineHeight: 44 }}>Prestige</Text>
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
                {/* Essence held, and what it does */}
                <View style={styles.hero}>
                    <Text size={44} style={{ lineHeight: 52 }}>✨</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text font="black" size={11} color={palette.muted} style={styles.caps}>EMOJI ESSENCE</Text>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{formatNumber(emojiEssence)}</Text>
                        <Text font="bold" size={13} color={palette.greenText}>
                            +{formatNumber(Math.round(emojiEssence * bonus * 100))}% production ({Math.round(bonus * 100)}% each)
                        </Text>
                    </View>
                </View>
                <Text font="body" size={14} color={palette.lilac} style={{ lineHeight: 20 }}>
                    After drawing enough emojis, their very essence starts gathering around you: a magical substance that changes shape whenever you look at it. Every unspent essence boosts production, and essence buys perks that last forever.
                </Text>

                {/* The prestige itself */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text size={20} color={palette.ink}>Start over</Text>
                        <Text font="black" size={12} color={palette.violetDeep}>{prestiges} PRESTIGE{prestiges === 1 ? "" : "S"} SO FAR</Text>
                    </View>
                    <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                        Resets your emojis, buildings, building upgrades and hands. You keep your collection, stats, combo upgrades, essence and perks.
                    </Text>
                    <View style={{ gap: 4 }}>
                        <View style={styles.rowBetween}>
                            <Text font="bold" size={12} color={palette.muted}>Next essence</Text>
                            <Text font="bold" size={12} color={palette.muted}>
                                at {formatNumber(emojisForEssence(allTimeEssence + 1), 2)} emojis drawn
                            </Text>
                        </View>
                        <View style={styles.track}>
                            <View style={[styles.fill, { width: `${Math.max(1, progress)}%` }]} />
                        </View>
                    </View>
                    <ChunkyButton
                        height={54}
                        labelSize={18}
                        label={pending < 1 ? "No essence to gain yet" : armed ? "Tap again to prestige" : `Prestige for +${formatNumber(pending)} ✨`}
                        sublabel={pending >= 1 && !armed ? `+${Math.round(pending * bonus * 100)}% PRODUCTION` : undefined}
                        disabled={pending < 1}
                        onPress={onPrestige}
                    />
                </View>

                {/* Perks, one tier per prestige */}
                <View style={styles.rowBetween}>
                    <Text size={20}>Perks</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{owned.length} of {perks.length} owned</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8 }}>
                    Spent essence no longer boosts production.
                </Text>
                {Array.from({ length: MAX_PERK_TIER }, (_, i) => i + 1).map(tier => (
                    <PerkTier key={tier} tier={tier} unlocked={prestiges >= tier} essence={emojiEssence} owned={owned} />
                ))}
            </ScrollView>
        </View>
    );
}

function PerkTier({ tier, unlocked, essence, owned }: { tier: number, unlocked: boolean, essence: number, owned: string[] }) {
    return (
        <View style={styles.tier}>
            <Text font="black" size={11} color={unlocked ? palette.sun : palette.lilac} style={styles.caps}>
                TIER {tier}{unlocked ? "" : ` · UNLOCKS WITH YOUR ${ordinal(tier).toUpperCase()} PRESTIGE`}
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

    return (
        <View style={[styles.perk, isOwned ? styles.perkOwned : null, !unlocked ? styles.perkLocked : null]}>
            <View style={[styles.perkIcon, isOwned ? { backgroundColor: palette.mint } : null]}>
                <Text size={24} style={{ lineHeight: 30, opacity: unlocked ? 1 : 0.4 }}>{unlocked ? perk.icon : "🔒"}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text size={16} color={unlocked ? palette.ink : "#FFFFFF"}>{unlocked ? perk.name : "???"}</Text>
                <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                    {unlocked ? perk.description : "Prestige to reveal this perk."}
                </Text>
                {unlocked && missing && !isOwned ? (
                    <Text font="bold" size={12} color={palette.pop}>Needs {missing.name} first</Text>
                ) : null}
            </View>
            {isOwned ? (
                <View style={styles.ownedTag}>
                    <Text font="black" size={12} color={palette.greenText}>✓ OWNED</Text>
                </View>
            ) : unlocked ? (
                <ChunkyButton
                    width={84}
                    height={40}
                    labelSize={15}
                    label={`✨ ${formatNumber(perk.cost)}`}
                    accessibilityLabel={`Buy ${perk.name} for ${perk.cost} essence`}
                    disabled={!affordable || !!missing}
                    onPress={() => purchasePerk(perk.id)}
                />
            ) : null}
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
    },
    caps: {
        letterSpacing: 1.2,
    },
    hero: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    card: {
        padding: 16,
        gap: 12,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
    },
    track: {
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.track,
        overflow: "hidden",
    },
    fill: {
        height: 8,
        borderRadius: 4,
        backgroundColor: palette.violet,
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
});
