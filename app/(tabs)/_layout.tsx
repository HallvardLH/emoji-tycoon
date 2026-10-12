import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar/TabBar";
import DesktopLayout from "../../components/layout/DesktopLayout";
import { useIsDesktop } from "../../components/layout/desktop";
import FreezeWhenBlurred from "../../components/layout/FreezeWhenBlurred";

export default function TabLayout() {
    // On desktop every tab is on screen at once (see desktop.ts)
    const isDesktop = useIsDesktop();
    if (isDesktop) return <DesktopLayout />;

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
            // Hidden tabs stay mounted; pause them so they don't re-render with the game
            screenLayout={({ navigation, children }) => <FreezeWhenBlurred navigation={navigation}>{children}</FreezeWhenBlurred>}
        >
            <Tabs.Screen name="shop" options={{ title: "Shop" }} />
            <Tabs.Screen name="index" options={{ title: "Emoji" }} />
            <Tabs.Screen name="emojidex" options={{ title: "Emojidex" }} />
        </Tabs>
    );
}
