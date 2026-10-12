import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar/TabBar";
import DesktopLayout from "../../components/layout/DesktopLayout";
import { useIsDesktop } from "../../components/layout/desktop";

export default function TabLayout() {
    // On desktop every tab is on screen at once (see desktop.ts)
    const isDesktop = useIsDesktop();
    if (isDesktop) return <DesktopLayout />;

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
