import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'react-native-redux-persist2';
import { startPersistence } from './persistence';
export { whenSaveLoaded } from './persistence';
import { SCREENSHOT_MODE } from '../screenshotMode';
import valuesSlice from './valuesSlice';
import buildingsSlice from './buildingsSlice';
import upgradesSlice from './upgradesSlice';
import bigEmojiSlice from './bigEmojiSlice';
import effectsSlice from './effectsSlice';
import collectionSlice from './collectionSlice';
import preferencesSlice from './preferencesSlice';
import statsSlice from './statsSlice';
import prestigeSlice from './prestigeSlice';
import tabsSlice from './tabsSlice';
import offlineSlice from './offlineSlice';
import gemsSlice from './gemsSlice';
import achievementsSlice from './achievementsSlice';

// Combine reducers
const rootReducer = combineReducers({
    values: valuesSlice,
    buildings: buildingsSlice,
    upgrades: upgradesSlice,
    bigEmoji: bigEmojiSlice,
    effects: effectsSlice,
    collection: collectionSlice,
    preferences: preferencesSlice,
    stats: statsSlice,
    prestige: prestigeSlice,
    tabs: tabsSlice,
    offline: offlineSlice,
    gems: gemsSlice,
    achievements: achievementsSlice,
});

// Merges the loaded save into the state when it arrives
const persistedReducer = persistReducer(rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Development-only checks. A late-game save is big enough that running them on every
            // game loop tick starves the JS thread, so screenshot mode (which stages one) skips them
            serializableCheck: SCREENSHOT_MODE ? false : {
                ignoredActions: ['persist/PERSIST'], // Ignore persist actions
            },
            immutableCheck: !SCREENSHOT_MODE,
        }),
});

// Load the save, then keep saving (see persistence.ts)
startPersistence(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;