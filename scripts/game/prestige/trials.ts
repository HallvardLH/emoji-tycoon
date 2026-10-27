import store from "../../redux/reduxStore";
import { abandonTrial as abandonTrialAction, completeTrial } from "../../redux/prestigeSlice";
import { celebrateMilestone } from "../milestones";
import { calculateEmojisPerSecond, calculateEpt } from "../calculations";
import { canBuyUpgrade } from "../upgrades/checks";
import { roundToPrettyNumber } from "../../utils";
import { formatNumber } from "../../misc";
import i18n from "../../../i18n";
import { getTrialName, getTrialReward } from "../../../i18n/content";
import { toCaps } from "../../utils";

/**
 * Trials: prestige into a run with a rule that makes it harder, and draw a set
 * amount of emojis that run to earn a reward kept forever. Reaching the goal
 * lifts the rule for the rest of the run. Each trial pays its reward once.
 *
 * Goals are a share of the emojis drawn in the run before, so they keep up
 * with however far the player has come.
 */
export interface Trial {
    id: string;
    icon: string;
    name: string;
    /** What makes the run harder */
    rule: string;
    /** What completing it gives, forever */
    reward: string;
    /** Emojis the run starts with, where the rule would leave no way to get going */
    startingEmojis?: number;
    /** The goal, as a share of the emojis drawn the run before */
    goalShare: number;
}

export const trials: Trial[] = [
    { id: "handsOff", icon: "🙅", name: "Hands off", rule: "Tapping the Big Emoji draws nothing", reward: "+15% production", goalShare: 0.25, startingEmojis: 1000 },
    { id: "bareBones", icon: "🦴", name: "Bare bones", rule: "Upgrades can't be bought", reward: "+50% emojis per tap", goalShare: 0.01 },
    { id: "darkSky", icon: "🌑", name: "Dark sky", rule: "No effect emojis appear", reward: "Effect emojis appear 25% more often", goalShare: 0.5 },
];

/** Trials open up after this many prestiges */
export const TRIALS_UNLOCK_PRESTIGES = 2;
const MIN_GOAL = 1e9;

export function areTrialsUnlocked() {
    return store.getState().prestige.prestiges >= TRIALS_UNLOCK_PRESTIGES;
}

/** Whether a trial's rule applies right now: it's being played and not yet completed */
export function isTrialActive(id: string) {
    const trial = store.getState().prestige.activeTrial;
    return trial?.id === id && !trial.completed;
}

export function hasCompletedTrial(id: string) {
    return store.getState().prestige.trialsCompleted?.includes(id) ?? false;
}

export function trialsCompletedCount() {
    return store.getState().prestige.trialsCompleted?.length ?? 0;
}

/** Emojis drawn this run */
export function runEmojis() {
    const { stats, prestige } = store.getState();
    return Math.max(0, stats.emojisGained - prestige.runStartEmojis);
}

/** The goal a trial would have if it started now: a share of the run that's ending */
export function trialGoal(trial: Trial) {
    return roundToPrettyNumber(Math.max(MIN_GOAL, runEmojis() * trial.goalShare));
}

/**
 * Completes the trial once its goal is reached
 *
 * Called every 2.5 s from the gameLoop
 */
export function checkTrial() {
    const active = store.getState().prestige.activeTrial;
    if (!active || active.completed || runEmojis() < active.goal) return;

    const trial = trials.find(t => t.id === active.id);
    store.dispatch(completeTrial());
    applyTrialRules();
    celebrateMilestone({
        icon: trial?.icon ?? "🏅",
        caption: toCaps(i18n.t("trials.completeCaps")),
        title: trial ? i18n.t("trials.completeTitle", { name: getTrialName(trial), reward: getTrialReward(trial) }) : i18n.t("trials.rewardUnlocked"),
        kind: "prestige",
    });
}

/** Gives up on the trial: its rule lifts, without the reward */
export function abandonTrial() {
    store.dispatch(abandonTrialAction());
    applyTrialRules();
}

/** Recalculates what trial rules and rewards touch, after one starts, ends or is completed */
export function applyTrialRules() {
    calculateEmojisPerSecond();
    calculateEpt();
    canBuyUpgrade();
}

/** A goal in words, e.g. "1.5 T emojis" */
export function formatGoal(goal: number) {
    return i18n.t("trials.goal", { amount: formatNumber(goal, 1) });
}

// ---- What the rules and rewards do, read by the game wherever they apply ----

/** Hands off: taps draw nothing. Bare bones (reward): +50% per tap */
export function trialTapMultiplier() {
    if (isTrialActive("handsOff")) return 0;
    return hasCompletedTrial("bareBones") ? 1.5 : 1;
}

/** Hands off (reward): +15% production */
export const trialProductionMultiplier = () => hasCompletedTrial("handsOff") ? 1.15 : 1;

/** Dark sky (reward): effect emojis appear 25% more often */
export const trialEffectSpawnMultiplier = () => hasCompletedTrial("darkSky") ? 1.25 : 1;

/** Bare bones: upgrades can't be bought */
export const canBuyUpgrades = () => !isTrialActive("bareBones");

/** Dark sky: no effect emojis */
export const canSpawnEffects = () => !isTrialActive("darkSky");
