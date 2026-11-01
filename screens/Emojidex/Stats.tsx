import StatsList from "../../components/collection/StatsList";
import { ScrollView } from "react-native";

export default function Stats() {
    return (
        // Scrolls once the per-building stats run past the screen
        <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ paddingBottom: 32 }}>
            <StatsList />
        </ScrollView>
    )
}
