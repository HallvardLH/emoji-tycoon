import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import valuesSlice from './valuesSlice';
import buildingsSlice from './buildingsSlice';
import upgradesSlice from './upgradesSlice';

// Combine reducers
const rootReducer = combineReducers({
    values: valuesSlice,
    buildings: buildingsSlice,
    upgrades: upgradesSlice,
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
