import { store } from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import emojis from "emoji.json"

export function tapEmoji() {
    store.dispatch(updateEmojis(store.getState().values.emojis + 1));
}