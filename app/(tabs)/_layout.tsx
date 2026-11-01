import { Tabs } from "expo-router";
import TabBar from "../../components/TabBar/TabBar";
import DesktopLayout from "../../components/layout/DesktopLayout";
import { useIsDesktop } from "../../components/layout/desktop";
import FreezeWhenBlurred from "../../components/layout/FreezeWhenBlurred";
import { useTranslation } from "react-i18next";
import { useHeaderHeight } from "../../components/header/headerHeight";
import { palette } from "../../components/misc/theme";

// Open on the Big Emoji, not the first tab in the bar (Shop)
export const unstable_settings = {
    anchor: "index",
};

export default function TabLayout() {
    // On desktop every tab is on screen at once (see desktop.ts)
    const isDesktop = useIsDesktop();
    const { t } = useTranslation();
    const headerHeight = useHeaderHeight();
    if (isDesktop) return <DesktopLayout />;

    return (
        <Tabs
            // The screens start below the (transparent) Header
            screenOptions={{ headerShown: false, sceneStyle: { paddingTop: headerHeight, backgroundColor: palette.grape } }}
            tabBar={(props) => <TabBar {...props} />}
            // Hidden tabs stay mounted; pause them so they don't re-render with the game
            screenLayout={({ navigation, children }) => <FreezeWhenBlurred navigation={navigation}>{children}</FreezeWhenBlurred>}
        >
            <Tabs.Screen name="shop" options={{ title: t("tabs.shop") }} />
            {/* Except the Big Emoji's, whose emoji rain falls behind the Header (see ScreenView's behindHeader) */}
            <Tabs.Screen name="index" options={{ title: t("tabs.emoji"), sceneStyle: { backgroundColor: palette.grape } }} />
            <Tabs.Screen name="emojidex" options={{ title: t("tabs.emojidex") }} />
        </Tabs>
    );
}
