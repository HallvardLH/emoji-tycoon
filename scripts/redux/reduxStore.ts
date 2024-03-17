// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import valuesSlice from './valuesSlice';

export const store = configureStore({
    reducer: {
        values: valuesSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
