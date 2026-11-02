import store from "../../redux/reduxStore";
import { setTraits } from "../../redux/prestigeSlice";
import { hasPerk } from "./perks";

/**
 * Traits: how the next run plays. They're free, and chosen while ascending (after a
 * prestige, before the next run begins), then kept for the whole run. Each one has an
 * upside and a downside, so picking one is a choice of play style rather than a straight
 * upgrade. You start with one trait slot; perks add more (Polymath, Ascendant).
 */
export interface Trait {
    id: string;
    icon: string;
    name: string;
    /** What it gives */
    upside: string;
    /** What it costs */
    downside: string;
    /** Prestiges needed before it can be picked */
    unlockAt: number;
    production?: number;
    tap?: number;
    buildingPrice?: number;
    upgradePrice?: number;
    effectSpawn?: number;
    goodEffectDuration?: number;
    shinyChance?: number;
    /** Added to the max combo */
    maxCombo?: number;
    comboDrain?: number;
}

export const traits: Trait[] = [
    { id: "tapper", icon: "👆", name: "Tapper", upside: "Taps are worth ×3", downside: "Production ×0.6", unlockAt: 1, tap: 3, production: 0.6 },
    { id: "idler", icon: "😴", name: "Idler", upside: "Production ×1.4", downside: "Taps are worth ×0.25", unlockAt: 1, production: 1.4, tap: 0.25 },
    { id: "architect", icon: "🏗️", name: "Architect", upside: "Buildings are 20% cheaper", downside: "Building upgrades cost ×3", unlockAt: 1, buildingPrice: 0.8, upgradePrice: 3 },
    { id: "gambler", icon: "🎲", name: "Gambler", upside: "Effect emojis appear twice as often", downside: "Good effects last half as long", unlockAt: 2, effectSpawn: 2, goodEffectDuration: 0.5 },
    { id: "treasureHunter", icon: "🔍", name: "Treasure hunter", upside: "Shiny emojis are 3 times as likely", downside: "Production ×0.85", unlockAt: 3, shinyChance: 3, production: 0.85 },
    { id: "comboArtist", icon: "🥁", name: "Combo artist", upside: "+2 to your max combo", downside: "The combo drains 50% faster", unlockAt: 4, maxCombo: 2, comboDrain: 1.5 },
];

/** How many traits a run can have: one, plus one each for Polymath and Ascendant (perks) */
export function traitSlots() {
    return 1 + (hasPerk("polymath") ? 1 : 0) + (hasPerk("ascendant") ? 1 : 0);
}

export function isTraitUnlocked(trait: Trait) {
    return store.getState().prestige.prestiges >= trait.unlockAt;
}

/** The traits this run is played with */
export function activeTraits(): Trait[] {
    const ids = store.getState().prestige.traits ?? [];
    return traits.filter(trait => ids.includes(trait.id));
}

type MultiplierKey = "production" | "tap" | "buildingPrice" | "upgradePrice" | "effectSpawn" | "goodEffectDuration" | "shinyChance" | "comboDrain";

/** The active traits' combined multiplier for one thing */
export function traitMultiplier(key: MultiplierKey) {
    return activeTraits().reduce((mult, trait) => mult * (trait[key] ?? 1), 1);
}

/** What the active traits add to the max combo */
export const traitMaxComboBonus = () => activeTraits().reduce((sum, trait) => sum + (trait.maxCombo ?? 0), 0);

/**
 * Picks or unpicks a trait for the next run. Only while ascending: a run keeps its traits.
 * When every slot is taken, picking another replaces the one picked first.
 */
export function toggleTrait(id: string) {
    const { ascending, traits: current = [] } = store.getState().prestige;
    const trait = traits.find(t => t.id === id);
    if (!ascending || !trait || !isTraitUnlocked(trait)) return;
    if (current.includes(id)) {
        store.dispatch(setTraits(current.filter(t => t !== id)));
        return;
    }
    const next = [...current, id];
    store.dispatch(setTraits(next.slice(Math.max(0, next.length - traitSlots()))));
}
