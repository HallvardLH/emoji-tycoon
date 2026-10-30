import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar/TabBar";
import DesktopLayout from "../../components/layout/DesktopLayout";
import { useIsDesktop } from "../../components/layout/desktop";
import FreezeWhenBlurred from "../../components/layout/FreezeWhenBlurred";
import { useTranslation } from "react-i18next";

// Open on the Big Emoji, not the first tab in the bar (Shop)
export const unstable_settings = {
    anchor: "index",
};

export default function TabLayout() {
    // On desktop every tab is on screen at once (see desktop.ts)
    const isDesktop = useIsDesktop();
    const { t } = useTranslation();
    if (isDesktop) return <DesktopLayout />;

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <TabBar {...props} />}
            // Hidden tabs stay mounted; pause them so they don't re-render with the game
            screenLayout={({ navigation, children }) => <FreezeWhenBlurred navigation={navigation}>{children}</FreezeWhenBlurred>}
        >
            <Tabs.Screen name="shop" options={{ title: t("tabs.shop") }} />
            <Tabs.Screen name="index" options={{ title: t("tabs.emoji") }} />
            <Tabs.Screen name="emojidex" options={{ title: t("tabs.emojidex") }} />
        </Tabs>
    );
}
