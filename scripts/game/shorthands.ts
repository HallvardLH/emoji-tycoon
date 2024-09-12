import { store } from "../redux/reduxStore"

export function howFun() {
    return store.getState().values.funValue;
}
