import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'react-native-redux-persist2';
import { startPersistence } from './persistence';
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
});

// Merges the loaded save into the state when it arrives
const persistedReducer = persistReducer(rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], // Ignore persist actions
            },
        }),
});

// Load the save, then keep saving (see persistence.ts)
startPersistence(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;