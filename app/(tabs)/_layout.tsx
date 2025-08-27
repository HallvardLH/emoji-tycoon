import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar/TabBar";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tabs.Screen name="shop" options={{ title: "Shop" }} />
            <Tabs.Screen name="index" options={{ title: "Emoji" }} />
            <Tabs.Screen name="emojidex" options={{ title: "Emojidex" }} />
        </Tabs>
    );
}