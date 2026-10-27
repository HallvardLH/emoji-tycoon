import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** Emojis the player can claim for time away, by watching an ad or paying */
export interface OfflineOffer {
    /** Seconds away, already capped */
    seconds: number;
    /** Production per second (without effects) when they came back */
    eps: number;
    /** Of the seconds away, how many the gem boost was on for (they pay double) */
    boostedSeconds?: number;
}

interface OfflineState {
    /** Waiting for the player to claim or dismiss it. Kept in the save, so closing the app doesn't lose it */
    offer?: OfflineOffer;
}

const initialState: OfflineState = {};

export const offlineSlice = createSlice({
    name: "offline",
    initialState,
    reducers: {
        setOfflineOffer: (state, action: PayloadAction<OfflineOffer | undefined>) => {
            state.offer = action.payload;
        },
        resetOffline: () => {
            return initialState;
        },
    },
});

export const { setOfflineOffer, resetOffline } = offlineSlice.actions;

export default offlineSlice.reducer;
