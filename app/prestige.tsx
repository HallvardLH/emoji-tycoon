import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import store, { RootState } from "../scripts/redux/reduxStore";
import { PastRun } from "../scripts/redux/prestigeSlice";
import { prestige, purchasePerk, essenceForEmojis, emojisForEssence, essenceRate, SLOWING_DOWN_SHARE, ESSENCE_CHARM_BONUS } from "../scripts/game/prestige/prestige";
import { ESSENCE_CHARM_COST, RESPEC_COST, buyEssenceCharm, buyRespec } from "../scripts/game/gems/gemShop";
import GemButton from "../components/gems/GemButton";
import { perks, Perk, MAX_PERK_TIER, essenceBonusPerEssence, essenceForBonus, hasPerk } from "../scripts/game/prestige/perks";
import { trials, Trial, TRIALS_UNLOCK_PRESTIGES, trialGoal, runEmojis, abandonTrial, formatGoal } from "../scripts/game/prestige/trials";
import { celebrateMilestone } from "../scripts/game/milestones";
import { formatDuration, formatNumber } from "../scripts/misc";
import { Trans, useTranslation } from "react-i18next";
import i18n, { getLanguage } from "../i18n";
import { getPerkName, getPerkDescription, getTrialName, getTrialRule, getTrialReward } from "../i18n/content";
import Text from "../components/generalUI/Text";
import ChunkyButton from "../components/generalUI/ChunkyButton";
import { palette, radii, themedStyles } from "../components/misc/theme";
import { toCaps } from "../scripts/utils";
import CloseButton from "../components/generalUI/CloseButton";

// How long the "tap again" confirmation stays armed
const CONFIRM_MS = 3000;
const ordinal = (n: number) => i18n.t("prestige.ordinal", { count: n, ordinal: true });
const percent = (value: number) => i18n.t("numbers.percent", { value: formatNumber(value) });
// Small caps lines are written in capitals; uppercasing values in them follows the language's rules
const upper = (text: string) => text.toLocaleUpperCase(getLanguage());

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
    const { t } = useTranslation();

    const onPrestige = (trial?: Trial) => {
        if (!confirm(trial?.id ?? "prestige")) return;
        const { essence: gained, gems } = prestige(trial?.id);
        if (gained > 0) {
            const count = prestiges + 1;
            const gemsText = gems > 0 ? ` · +${gems} 💎` : "";
            celebrateMilestone({
                icon: trial?.icon ?? "✨",
                caption: (trial ? toCaps(t("prestige.celebrateTrialCaption", { count })) : toCaps(t("prestige.celebrateCaption", { count }))) + gemsText,
                title: count <= MAX_PERK_TIER ? t("prestige.celebrateTierTitle", { essence: gained, tier: count }) : t("prestige.celebrateTitle", { essence: gained }),
                kind: "prestige",
            });
        }
    };

    const trialRunning = !!activeTrial && !activeTrial.completed;

    return (
        <View style={styles.screen}>
            <SafeAreaView edges={["top"]} style={styles.topBar}>
                <Text size={30} style={{ lineHeight: 44 }}>{t("prestige.title")}</Text>
                <CloseButton size={44} accessibilityLabel={t("prestige.close")} onPress={() => router.back()} />
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Essence held, and what it does */}
                <View style={styles.hero}>
                    <Text size={44} style={{ lineHeight: 52 }}>✨</Text>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text font="black" size={11} color={palette.muted} style={styles.caps}>{toCaps(t("prestige.essenceCaption"))}</Text>
                        <Text size={34} color={palette.ink} style={{ lineHeight: 38 }}>{formatNumber(emojiEssence)}</Text>
                        <Text font="bold" size={13} color={palette.greenText}>
                            {t("prestige.essenceBonus", { bonus: percent(Math.round(essenceForBonus() * bonus * 100)), each: percent(Math.round(bonus * 100)) })}
                        </Text>
                    </View>
                </View>
                <Text font="body" size={14} color={palette.lilac} style={{ lineHeight: 20 }}>
                    {t("prestige.intro")}
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
                        <Text size={20} color={palette.ink}>{t("prestige.startOver")}</Text>
                        <Text font="black" size={12} color={palette.violetDeep}>{toCaps(t("prestige.prestigesSoFar", { count: prestiges }))}</Text>
                    </View>
                    <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                        {t("prestige.resetsWhat")}
                    </Text>
                    <RunStats runSeconds={runSeconds} pending={pending} />
                    <View style={{ gap: 4 }}>
                        <View style={styles.rowBetween}>
                            <Text font="bold" size={12} color={palette.muted}>{t("prestige.nextEssence")}</Text>
                            <Text font="bold" size={12} color={palette.muted}>
                                {t("prestige.nextEssenceAt", { amount: formatNumber(emojisForEssence(allTimeEssence + 1), 2) })}
                            </Text>
                        </View>
                        <View style={styles.track}>
                            <View style={[styles.fill, { width: `${Math.max(1, progress)}%` }]} />
                        </View>
                    </View>
                    <ChunkyButton
                        height={54}
                        labelSize={18}
                        label={pending < 1 ? t("prestige.noEssenceYet") : armed === "prestige" ? t("prestige.tapAgainToPrestige") : t("prestige.prestigeFor", { essence: formatNumber(pending) })}
                        sublabel={pending >= 1 && armed !== "prestige" ? toCaps(t("prestige.productionCaps", { percent: percent(Math.round(pending * bonus * 100)) })) : undefined}
                        disabled={pending < 1}
                        onPress={() => onPrestige()}
                    />
                </View>

                <GemExtras pending={pending} perksOwned={owned.length} />

                {/* Trials: prestige into a harder run for a reward kept forever */}
                <View style={styles.rowBetween}>
                    <Text size={20}>{t("trials.title")}</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{t("trials.completedCount", { done: trialsCompleted?.length ?? 0, total: trials.length })}</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8, lineHeight: 18 }}>
                    {prestiges >= TRIALS_UNLOCK_PRESTIGES
                        ? t("trials.intro")
                        : t("trials.unlocksWith", { ordinal: ordinal(TRIALS_UNLOCK_PRESTIGES) })}
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
                    <Text size={20}>{t("perks.title")}</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{t("perks.ownedCount", { owned: owned.length, total: perks.length })}</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ marginTop: -8 }}>
                    {hasPerk("overflow") ? t("perks.spentKeepsHalf") : t("perks.spentNoBonus")}
                </Text>
                {Array.from({ length: MAX_PERK_TIER }, (_, i) => i + 1).map(tier => (
                    <PerkTier key={tier} tier={tier} unlocked={prestiges >= tier} essence={emojiEssence} owned={owned} />
                ))}

                {history && history.length > 0 ? <PastRuns history={history} prestiges={prestiges} /> : null}
            </ScrollView>
        </View>
    );
}

/** Gem buys for prestiging: more essence from the next one, and taking perks back */
function GemExtras({ pending, perksOwned }: { pending: number, perksOwned: number }) {
    const { t } = useTranslation();
    const charmOn = useSelector((state: RootState) => state.gems.essenceCharm ?? false);
    const percent = t("numbers.percent", { value: Math.round(ESSENCE_CHARM_BONUS * 100) });
    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text size={20} color={palette.ink}>{t("prestige.gemExtras")}</Text>
                <Text font="black" size={12} color={palette.violetDeep}>💎</Text>
            </View>
            <View style={styles.gemExtra}>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text size={16} color={palette.ink}>🍀 {t("prestige.charmName")}</Text>
                    <Text font="body" size={13} color={palette.muted} style={{ lineHeight: 18 }}>
                        {!charmOn
                            ? t("prestige.charmOff", { percent })
                            : pending >= 1
                                ? t("prestige.charmOnAmount", { percent, essence: formatNumber(Math.ceil(pending * ESSENCE_CHARM_BONUS)) })
                                : t("prestige.charmOn", { percent })}
                    </Text>
                </View>
                <GemButton
                    cost={ESSENCE_CHARM_COST}
                    onBuy={buyEssenceCharm}
                    disabled={charmOn}
                    disabledLabel={`✓ ${toCaps(t("prestige.onCaps"))}`}
                    accessibilityLabel={t("prestige.charmA11y")}
                />
            </View>
            {perksOwned > 0 && (
                <View style={styles.gemExtra}>
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text size={16} color={palette.ink}>🔄 {t("prestige.respecName")}</Text>
                        <Text font="body" size={13} color={palette.muted} style={{ lineHeight: 18 }}>
                            {t("prestige.respecDescription")}
                        </Text>
                    </View>
                    <GemButton cost={RESPEC_COST} onBuy={buyRespec} accessibilityLabel={t("prestige.respecA11y")} />
                </View>
            )}
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
    const { t } = useTranslation();

    const rows: [string, string][] = [
        [t("prestige.playedThisRun"), formatDuration(runSeconds)],
        [t("prestige.drawnThisRun"), formatNumber(drawn, 1)],
        [t("prestige.essencePerHour"), rate === undefined
            ? t("prestige.afterTenMinutes")
            : t("prestige.essenceRate", { rate: formatNumber(rate, rate < 10 ? 1 : 0), best: formatNumber(best, best < 10 ? 1 : 0) })],
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
                    {t("prestige.slowingDown")}
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
    const { t } = useTranslation();
    if (!trial) return null;
    const drawn = runEmojis();
    const share = Math.min(1, drawn / goal);
    const reward = getTrialReward(trial);

    return (
        <View style={[styles.card, styles.activeTrial, completed ? styles.perkOwned : null]}>
            <View style={styles.trialHead}>
                <View style={styles.perkIcon}><Text size={24} style={{ lineHeight: 30 }}>{trial.icon}</Text></View>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text font="black" size={11} color={completed ? palette.greenText : palette.pop} style={styles.caps}>
                        {completed ? toCaps(t("trials.completeCaps")) : toCaps(t("trials.inProgressCaps"))}
                    </Text>
                    <Text size={18} color={palette.ink}>{getTrialName(trial)}</Text>
                </View>
            </View>
            <Text font="body" size={14} color={palette.muted} style={{ lineHeight: 20 }}>
                {completed
                    ? t("trials.completedText", { reward })
                    // English lowercases the reward mid-sentence; other languages keep it as written
                    : t("trials.activeText", { rule: getTrialRule(trial), goal: formatGoal(goal), reward: getLanguage() === "en" ? reward.toLowerCase() : reward })}
            </Text>
            {!completed ? (
                <>
                    <View style={{ gap: 4 }}>
                        <View style={styles.rowBetween}>
                            <Text font="bold" size={12} color={palette.muted}>{t("prestige.drawnAmount", { amount: formatNumber(drawn, 1) })}</Text>
                            <Text font="bold" size={12} color={palette.muted}>{percent(Math.floor(share * 100))}</Text>
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
                            {armed ? t("trials.giveUpConfirm") : t("trials.giveUp")}
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
    const { t } = useTranslation();
    let action;
    if (completed) {
        action = <View style={styles.ownedTag}><Text font="black" size={12} color={palette.greenText}>{toCaps(t("trials.doneTag"))}</Text></View>;
    } else if (playing) {
        action = <View style={[styles.ownedTag, styles.playingTag]}><Text font="black" size={12} color={palette.pop}>{toCaps(t("trials.playingTag"))}</Text></View>;
    }

    return (
        <View style={[styles.perk, styles.trial, completed ? styles.perkOwned : null, !unlocked ? styles.perkLocked : null]}>
            <View style={styles.trialHead}>
                <View style={[styles.perkIcon, completed ? { backgroundColor: palette.mint } : null]}>
                    <Text size={24} style={{ lineHeight: 30, opacity: unlocked ? 1 : 0.4 }}>{trial.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text size={16} color={unlocked ? palette.ink : "#FFFFFF"}>{getTrialName(trial)}</Text>
                    <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                        <Trans
                            i18nKey={trial.startingEmojis ? "trials.ruleLineWithStart" : "trials.ruleLine"}
                            values={{ rule: getTrialRule(trial), amount: trial.startingEmojis ? formatNumber(trial.startingEmojis) : "" }}
                            components={{ hl: <Text font="black" size={13} color={unlocked ? palette.pop : palette.lilac} /> }}
                        />
                    </Text>
                    <Text font="body" size={13} color={unlocked ? palette.muted : palette.lilac} style={{ lineHeight: 18 }}>
                        <Trans
                            i18nKey="trials.rewardLine"
                            values={{ reward: getTrialReward(trial) }}
                            components={{ hl: <Text font="black" size={13} color={unlocked ? palette.greenText : palette.lilac} /> }}
                        />
                    </Text>
                </View>
                {action}
            </View>
            {unlocked && !completed && !playing ? (
                <ChunkyButton
                    height={44}
                    labelSize={15}
                    label={blocked ? t("trials.finishFirst") : pending < 1 ? t("trials.needsEssence") : armed ? t("trials.tapAgainToStart") : t("trials.prestigeInto", { essence: formatNumber(pending) })}
                    sublabel={!blocked && pending >= 1 && !armed ? toCaps(t("trials.goalCaps", { goal: upper(formatGoal(trialGoal(trial))) })) : undefined}
                    disabled={blocked || pending < 1}
                    onPress={onStart}
                />
            ) : null}
        </View>
    );
}

function PastRuns({ history, prestiges }: { history: PastRun[], prestiges: number }) {
    const { t } = useTranslation();
    return (
        <View style={{ gap: 8 }}>
            <Text size={20}>{t("prestige.pastRuns")}</Text>
            <View style={styles.card}>
                {history.map((run, i) => {
                    const trial = run.trial ? trials.find(t => t.id === run.trial) : undefined;
                    return (
                        <View key={prestiges - i} style={[styles.pastRun, i > 0 ? styles.divider : null]}>
                            <Text font="black" size={12} color={palette.violetDeep} style={styles.runNumber}>#{prestiges - i}</Text>
                            <View style={{ flex: 1, gap: 1 }}>
                                <Text font="bold" size={13} color={palette.ink}>
                                    {t("prestige.pastRunLine", { duration: run.seconds > 0 ? formatDuration(run.seconds) : "—", amount: formatNumber(run.emojis, 1) })}
                                </Text>
                                {trial ? (
                                    <Text font="bold" size={12} color={run.trialCompleted ? palette.greenText : palette.muted}>
                                        {run.trialCompleted
                                            ? t("prestige.pastRunTrialCompleted", { icon: trial.icon, name: getTrialName(trial) })
                                            : t("prestige.pastRunTrialNotCompleted", { icon: trial.icon, name: getTrialName(trial) })}
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

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.grape,
    },
    gemExtra: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
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
}));
