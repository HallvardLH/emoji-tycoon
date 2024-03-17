import { store } from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';

// Function to increment valueA by a specific amount (default is 1)
export const increment = (amount: number = 1) => {
    // First, get the current value of valueA from the store's state
    const currentValue = store.getState().values.emojis;

    // Then, dispatch the action to update valueA with the new incremented value
    store.dispatch(updateEmojis(currentValue + amount));
};