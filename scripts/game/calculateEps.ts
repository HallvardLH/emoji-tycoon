import { calculateBuildingsEps } from "./buildings";
import { store } from "../redux/reduxStore";

export function calculateEps() {
    calculateBuildingsEps();
}