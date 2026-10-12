import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import store, { RootState } from "../scripts/redux/reduxStore";
import { PastRun } from "../scripts/redux/prestigeSlice";
import { prestige, purchasePerk, essenceForEmojis, emojisForEssence, essenceRate, SLOWING_DOWN_SHARE } from "../scripts/game/prestige/prestige";
import { perks, Perk, MAX_PERK_TIER, essenceBonusPerEssence, essenceForBonus, hasPerk } from "../scripts/game/prestige/perks";
import { trials, Trial, TRIALS_UNLOCK_PRESTIGES, trialGoal, runEmojis, abandonTrial, formatGoal } from "../scripts/game/prestige/trials";
import { celebrateMilestone } from "../scripts/game/milestones";
import { formatDuration, formatNumber } from "../scripts/misc";
import Text from "../components/generalUI/Text";
import ChunkyButton from "../components/generalUI/ChunkyButton";
import { palette, radii } from "../components/misc/theme";

// How long the "tap again" confirmation stays armed
const CONFIRM_MS = 3000;
const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

/**
 * A button action that takes a second tap to confirm, as it can't be undone.
 * Only one can be armed at a time, named by key.
 */
function useConfirm() {
    const [armed, setArmed] = useState<string | null>(null);
    useEffect(() => {
        if (!armed) return;
        const timeout = setTimeout(() => setArmed(null), CONFIRM_MS);
        return () => clearTimeout(timeout);
    }, [armed]);

    /** @returns whether this tap confirms it */
    const confirm = (key: string) => {
        if (armed !== key) { setArmed(key); return false; }
        setArmed(null);
        return true;
    };
    return { armed, confirm };
}

/** Emoji essence: prestiging, trials, perks and past runs */
export default function PrestigeScreen() {
    const router = useRouter();
    const { emojiEssence, totalEssenceEarned, prestiges, perks: owned, activeTrial, trialsCompleted, history } = useSelector((state: RootState) => state.prestige);
    // Derived, so the screen doesn't re-render every tick
    const allTimeEssence = useSelector((state: RootState) => essenceForEmojis(state.stats.emojisGained));
    const progress = useSelector((state: RootState) => state.prestige.remainingEmojisPrestigePerc);
    // Ticks once a second, which also refreshes the run figures read from the store below
    const runSeconds = useSelector((state: RootState) => state.prestige.runSeconds ?? 0);
    const pending = Math.max(0, allTimeEssence - totalEssenceEarned);
    const bonus = essenceBonusPerEssence();
    const { armed, confirm } = useConfirm();

    const onPrestige = (trial?: Trial) => {
        if (!confirm(trial?.id ?? "prestige")) return;
        const gained = prestige(trial?.id);
        if (gained > 0) {
            const count = prestiges + 1;
            celebrateMilestone({
                icon: trial?.icon ?? "✨",
                caption: trial ? `PRESTIGE #${count} · TRIAL STARTED` : `PRESTIGE #${count}`,
                title: count <= MAX_PERK_TIER ? `+${gained} essence · tier ${count} perks unlocked` : `+${gained} essence`,
            });
        }
    };

    const trialRunning = !!activeTrial && !activeTrial.completed;

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
                            +{formatNumber(Math.round(essenceForBonus() * bonus * 100))}% production ({Math.round(bonus * 100)}% each)
                        </Text>
                    </View>
                </View>
                <Text font="body" size={14} color={palette.lilac} style={{ lineHeight: 20 }}>
                    After drawing enough emojis, their very essence starts gathering around you: a magical substance that changes shape whenever you look at it. Every unspent essence boosts production, and essence buys perks that last forever.
                </Text>

                {activeTrial ? (
                    <ActiveTrialCard
                        trial={trials.find(t => t.id === activeTrial.id)}
                        goal={activeTrial.goal}
                        completed={activeTrial.completed}
                        armed={armed === "abandon"}
                        onAbandon={() => { if (confirm("abandon")) abandonTrial(); }}
                    />
                ) : null}

                {/* The prestige itself */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text size={20} color={palette.ink}>Start over</Text>
                        <Text font="black" size={12} color={palette.violetDeep}>{prestiges} PRESTIGE{prestiges === 1 ? "" : "S"} SO FAR</Text>
                    </View>
                    <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                        Resets your emojis, buildings, building upgrades and hands. You keep your collection, stats, combo and effect emoji upgrades, essence and perks.
                    </Text>
                    <RunStats runSeconds={runSeconds} pending={pending} />
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
                        label={pending < 1 ? "No essence to gain yet" : armed === "prestige" ? "Tap again to prestige" : `Prestige for +${formatNumber(pending)} ✨`}
                        sublabel={pending >= 1 && armed !== "prestige" ? `+${Math.round(pending * bonus * 100)}% PRODUCTION` : undefined}
                        disabled={pending < 1}
                        onPress={() => onPrestige()}
                    />
                </View>

                {/* Trials: prestige into a harder run for a reward kept forever */}
                <View style={styles.rowBetween}>
                    <Text size={20}>Trials</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{trialsCompleted?.length ?? 0} of {trials.length} completed</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8, lineHeight: 18 }}>
                    {prestiges >= TRIALS_UNLOCK_PRESTIGES
                        ? "Prestige into a run with a rule that makes it harder. Draw enough emojis that run to keep its reward forever, and the rule lifts."
                        : `Unlocks with your ${ordinal(TRIALS_UNLOCK_PRESTIGES)} prestige.`}
                </Text>
                {trials.map(trial => (
                    <TrialCard
                        key={trial.id}
                        trial={trial}
                        unlocked={prestiges >= TRIALS_UNLOCK_PRESTIGES}
                        completed={trialsCompleted?.includes(trial.id) ?? false}
                        playing={activeTrial?.id === trial.id && !activeTrial.completed}
                        blocked={trialRunning}
                        pending={pending}
                        armed={armed === trial.id}
                        onStart={() => onPrestige(trial)}
                    />
                ))}

                {/* Perks, one tier per prestige */}
                <View style={styles.rowBetween}>
                    <Text size={20}>Perks</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{owned.length} of {perks.length} owned</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8 }}>
                    {hasPerk("overflow") ? "Spent essence keeps half its production bonus." : "Spent essence no longer boosts production."}
                </Text>
                {Array.from({ length: MAX_PERK_TIER }, (_, i) => i + 1).map(tier => (
                    <PerkTier key={tier} tier={tier} unlocked={prestiges >= tier} essence={emojiEssence} owned={owned} />
                ))}

                {history && history.length > 0 ? <PastRuns history={history} prestiges={prestiges} /> : null}
            </ScrollView>
        </View>
    );
}

/** How the run is going, and whether it's slowing down enough to prestige */
function RunStats({ runSeconds, pending }: { runSeconds: number, pending: number }) {
    // Read on each render; the parent re-renders once a second
    const drawn = runEmojis();
    const rate = essenceRate(runSeconds);
    const best = store.getState().prestige.runBestEssenceRate ?? 0;
    const slowing = pending >= 1 && rate !== undefined && best > 0 && rate < best * SLOWING_DOWN_SHARE;

    const rows: [string, string][] = [
        ["Played this run", formatDuration(runSeconds)],
        ["Drawn this run", formatNumber(drawn, 1)],
        ["Essence per hour", rate === undefined ? "after 10 min" : `${formatNumber(rate, rate < 10 ? 1 : 0)} (best ${formatNumber(best, best < 10 ? 1 : 0)})`],
    ];

    return (
        <View style={styles.runStats}>
            {rows.map(([label, value]) => (
                <View key={label} style={styles.rowBetween}>
                    <Text font="bold" size={13} color={palette.muted}>{label}</Text>
                    <Text font="black" size={13} color={palette.ink}>{value}</Text>
                </View>
            ))}
            {slowing ? (
                <Text font="bold" size={12} color={palette.greenText} style={{ lineHeight: 17 }}>
                    📉 Essence is coming in slower than earlier this run. A good time to prestige.
                </Text>
            ) : null}
        </View>
    );
}

interface ActiveTrialCardProps {
    trial?: Trial;
    goal: number;
    completed: boolean;
    armed: boolean;
    onAbandon: () => void;
}

function ActiveTrialCard({ trial, goal, completed, armed, onAbandon }: ActiveTrialCardProps) {
    if (!trial) return null;
    const drawn = runEmojis();
    const share = Math.min(1, drawn / goal);

    return (
        <View style={[styles.card, styles.activeTrial, completed ? styles.perkOwned : null]}>
            <View style={styles.trialHead}>
                <View style={styles.perkIcon}><Text size={24} style={{ lineHeight: 30 }}>{trial.icon}</Text></View>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text font="black" size={11} color={completed ? palette.greenText : palette.pop} style={styles.caps}>
                        {completed ? "TRIAL COMPLETE" : "TRIAL IN PROGRESS"}
                    </Text>
                    <Text size={18} color={palette.ink}>{trial.name}</Text>
                </View>
            </View>
            <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                {completed
                    ? `${trial.reward} is yours for good, and the rule is lifted for the rest of this run.`
                    : `${trial.rule}. Draw ${formatGoal(goal)} this run to earn ${trial.reward.toLowerCase()} forever.`}
            </Text>
            {!completed ? (
                <>
                    <View style={{ gap: 4 }}>
                        <View style={styles.rowBetween}>
                            <Text font="bold" size={12} color={palette.muted}>{formatNumber(drawn, 1)} drawn</Text>
                            <Text font="bold" size={12} color={palette.muted}>{Math.floor(share * 100)}%</Text>
                        </View>
                        <View style={styles.track}>
                            <View style={[styles.fill, styles.fillTrial, { width: `${Math.max(1, share * 100)}%` }]} />
                        </View>
                    </View>
                    <Pressable
                        accessibilityRole="button"
                        onPress={onAbandon}
                        style={({ pressed }) => [styles.giveUp, pressed ? { opacity: 0.6 } : null]}
                    >
                        <Text font="bold" size={13} color={armed ? palette.pop : palette.muted}>
                            {armed ? "Tap again to give up (no reward)" : "Give up on this trial"}
                        </Text>
                    </Pressable>
                </>
            ) : null}
        </View>
    );
}

interface TrialCardProps {
    trial: Trial;
    unlocked: boolean;
    completed: boolean;
    playing: boolean;
    /** Another trial is being played */
    blocked: boolean;
    pending: number;
    armed: boolean;
    onStart: () => void;
}

function TrialCard({ trial, unlocked, completed, playing, blocked, pending, armed, onStart }: TrialCardProps) {
    let action;
    if (completed) {
        action = <View style={styles.ownedTag}><Text font="black" size={12} color={palette.greenText}>✓ DONE</Text></View>;
    } else if (playing) {
        action = <View style={[styles.ownedTag, styles.playingTag]}><Text font="black" size={12} color={palette.pop}>PLAYING</Text></View>;
    }

    return (
        <View style={[styles.perk, styles.trial, completed ? styles.perkOwned : null, !unlocked ? styles.perkLocked : null]}>
            <View style={styles.trialHead}>
                <View style={[styles.perkIcon, completed ? { backgroundColor: palette.mint } : null]}>
                    <Text size={24} style={{ lineHeight: 30, opacity: unlocked ? 1 : 0.4 }}>{trial.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text size={16} color={unlocked ? palette.ink : "#FFFFFF"}>{trial.name}</Text>
                    <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                        <Text font="black" size={13} color={unlocked ? palette.pop : palette.lilac}>Rule: </Text>{trial.rule}
                        {trial.startingEmojis ? ` (you start with ${formatNumber(trial.startingEmojis)} emojis)` : ""}
                    </Text>
                    <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                        <Text font="black" size={13} color={unlocked ? palette.greenText : palette.lilac}>Reward: </Text>{trial.reward}
                    </Text>
                </View>
                {action}
            </View>
            {unlocked && !completed && !playing ? (
                <ChunkyButton
                    height={44}
                    labelSize={15}
                    label={blocked ? "Finish your trial first" : pending < 1 ? "Needs essence to prestige" : armed ? "Tap again to start" : `Prestige into trial for +${formatNumber(pending)} ✨`}
                    sublabel={!blocked && pending >= 1 && !armed ? `GOAL: ${formatGoal(trialGoal(trial)).toUpperCase()}` : undefined}
                    disabled={blocked || pending < 1}
                    onPress={onStart}
                />
            ) : null}
        </View>
    );
}

function PastRuns({ history, prestiges }: { history: PastRun[], prestiges: number }) {
    return (
        <View style={{ gap: 8 }}>
            <Text size={20}>Past runs</Text>
            <View style={styles.card}>
                {history.map((run, i) => {
                    const trial = run.trial ? trials.find(t => t.id === run.trial) : undefined;
                    return (
                        <View key={prestiges - i} style={[styles.pastRun, i > 0 ? styles.divider : null]}>
                            <Text font="black" size={12} color={palette.violetDeep} style={styles.runNumber}>#{prestiges - i}</Text>
                            <View style={{ flex: 1, gap: 1 }}>
                                <Text font="bold" size={13} color={palette.ink}>
                                    {run.seconds > 0 ? formatDuration(run.seconds) : "—"} · {formatNumber(run.emojis, 1)} drawn
                                </Text>
                                {trial ? (
                                    <Text font="bold" size={12} color={run.trialCompleted ? palette.greenText : palette.muted}>
                                        {trial.icon} {trial.name}{run.trialCompleted ? " ✓" : ", not completed"}
                                    </Text>
                                ) : null}
                            </View>
                            <Text size={16} color={palette.ink}>+{formatNumber(run.essence)} ✨</Text>
                        </View>
                    );
                })}
            </View>
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
    activeTrial: {
        borderWidth: 2,
        borderColor: palette.pop,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
    },
    runStats: {
        gap: 6,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.tile,
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
    fillTrial: {
        backgroundColor: palette.pop,
    },
    giveUp: {
        alignItems: "center",
        paddingVertical: 4,
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
    trial: {
        flexDirection: "column",
        alignItems: "stretch",
    },
    trialHead: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
    playingTag: {
        backgroundColor: "#FFE3E9",
    },
    pastRun: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: palette.track,
    },
    runNumber: {
        width: 30,
    },
});
