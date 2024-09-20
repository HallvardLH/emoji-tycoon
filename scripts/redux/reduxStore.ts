import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import valuesSlice from './valuesSlice';
import buildingsSlice from './buildingsSlice';
import upgradesSlice from './upgradesSlice';
import bigEmojiSlice from './bigEmojiSlice';
import effectsSlice from './effectsSlice';
import collectionSlice from './collectionSlice';
import preferencesSlice from './preferencesSlice';
import statsSlice from './statsSlice';

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
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // Optionally you can add version number, whitelist or blacklist to the configuration
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
