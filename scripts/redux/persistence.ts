import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { prefix, rehydrateActionType } from 'react-native-redux-persist2';
import type { Store } from '@reduxjs/toolkit';

/**
 * Saves the game to AsyncStorage (localStorage on the web) and loads it on start.
 *
 * Replaces react-native-redux-persist2's initStore, which wrote the whole state on
 * every dispatch (10+ times a second) and started saving before the old save had
 * loaded, so an early dispatch could overwrite it. Its persistReducer still handles
 * merging the loaded save into the state.
 *
 * The game mustn't run until the save is in (see whenSaveLoaded): startup checks,
 * migrations and the offline earnings offer all read it.
 */

// Same key the library used, so existing saves load
const STORAGE_KEY = `${prefix}root`;
// The last save that loaded, kept apart from the save itself. If the save is ever
// unreadable (cut off mid-write, a full disk), the game starts from this instead of from nothing
const BACKUP_KEY = `${STORAGE_KEY}:backup`;
// An unreadable save is put aside here rather than overwritten, in case it can be rescued
const CORRUPT_KEY = `${STORAGE_KEY}:corrupt`;
// Changes are written at most this often, plus straight away when the app is hidden
const SAVE_INTERVAL_MS = 1000;

/** Parses a save, or returns undefined if it isn't a readable one */
function parseSave(saved: string | null): object | undefined {
    if (!saved) return undefined;
    try {
        const parsed = JSON.parse(saved);
        return parsed && typeof parsed === "object" ? parsed : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Reads the save, falling back to the backup when it's unreadable
 *
 * @returns the saved state, or undefined for a new game
 */
async function readSave() {
    let saved: string | null = null;
    try {
        saved = await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.error("Loading the save failed", error);
    }

    const payload = parseSave(saved);
    if (payload) {
        // A good save: it's the backup from now on
        AsyncStorage.setItem(BACKUP_KEY, saved!).catch(error => console.warn("Backing up the save failed", error));
        return payload;
    }

    // No save, or one that can't be read: try the backup
    try {
        const backup = parseSave(await AsyncStorage.getItem(BACKUP_KEY));
        if (saved) {
            console.error("The save couldn't be read; loading the backup");
            await AsyncStorage.setItem(CORRUPT_KEY, saved);
        }
        return backup;
    } catch (error) {
        console.error("Loading the backup failed", error);
        return undefined;
    }
}

let resolveLoaded: () => void;
const saveLoaded = new Promise<void>(resolve => { resolveLoaded = resolve; });

/** Resolves once the save has loaded into the store (or there was none) */
export function whenSaveLoaded() {
    return saveLoaded;
}

export function startPersistence(store: Store) {
    let loaded = false;
    let dirty = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const save = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
        // Never save before the old save is in, or a fresh game would overwrite it
        if (!loaded || !dirty) return;
        dirty = false;
        // On the web this writes to localStorage synchronously, so it lands even as the page closes
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState())).catch(error => {
            dirty = true;
            console.error("Saving the game failed", error);
        });
    };

    const saveSoon = () => {
        dirty = true;
        if (!timer) timer = setTimeout(save, SAVE_INTERVAL_MS);
    };

    const load = async () => {
        const payload = await readSave();
        try {
            store.dispatch({ type: rehydrateActionType, payload });
        } catch (error) {
            // A save the reducers can't take; the state is left as a new game
            console.error("Loading the save into the game failed", error);
        }
        loaded = true;
        store.subscribe(saveSoon);
        resolveLoaded();
    };

    // Save right away when the player leaves
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
        window.addEventListener('pagehide', save);
    } else {
        AppState.addEventListener('change', state => { if (state !== 'active') save(); });
    }

    return load();
}
