import { configureStore } from '@reduxjs/toolkit';
import valuesSlice from './valuesSlice';
import buildingsSlice from './buildingsSlice';

export const store = configureStore({
    reducer: {
        values: valuesSlice,
        buildings: buildingsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
