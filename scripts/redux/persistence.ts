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
 */

// Same key the library used, so existing saves load
const STORAGE_KEY = `${prefix}root`;
// Changes are written at most this often, plus straight away when the app is hidden
const SAVE_INTERVAL_MS = 1000;

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
        let payload: unknown;
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved !== null) payload = JSON.parse(saved);
        } catch (error) {
            console.error("Loading the save failed", error);
        }
        store.dispatch({ type: rehydrateActionType, payload });
        loaded = true;
        store.subscribe(saveSoon);
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
