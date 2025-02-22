import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
    persistReducer,
    initStore,
    PersistConfig,
} from 'react-native-redux-persist2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import valuesSlice from './valuesSlice';
import buildingsSlice from './buildingsSlice';
import upgradesSlice from './upgradesSlice';
import bigEmojiSlice from './bigEmojiSlice';
import effectsSlice from './effectsSlice';
import collectionSlice from './collectionSlice';
import preferencesSlice from './preferencesSlice';
import statsSlice from './statsSlice';
import prestigeSlice from './prestigeSlice';

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
});

// Persist configuration
const persistConfig: PersistConfig = {
    key: 'root', // Key to store the data
    storage: {
        type: 'AsyncStorage', // The storage that you want to use
        // asyncStorage: AsyncStorage, // Pass the AsyncStorage instance
    },
    // Optionally, you can add version number, whitelist, or blacklist to the configuration
};

// Create the persisted reducer
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

// Initialize the store and rehydrate it
initStore(store, persistConfig);

export const persistor = initStore(store, persistConfig);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;