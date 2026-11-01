import { View } from "react-native";
import { TopTabs } from "expo-router/js-top-tabs";
import TopTabBar from "../../../components/TabBar/TopTabBar";
import { palette } from "../../../components/misc/theme";
import { useTranslation } from "react-i18next";

// Open the Shop on Buildings
export const unstable_settings = {
    anchor: "buildings",
};

export default function Shop() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, backgroundColor: palette.grape }}>
            <TopTabs
                tabBar={(props) => <TopTabBar {...props} />}
                screenOptions={{ sceneStyle: { backgroundColor: palette.grape } }}
                // Buildings and Upgrades are both mounted, and not frozen (FreezeWhenBlurred) like the
                // tabs: frozen inside the frozen Shop tab, the hidden one stalled every timer in the
                // app on iOS (the game, the bank counting up) until the next tap. The hidden one stops
                // sampling the bank instead (useBank), which was all that re-rendered it regularly
            >
                <TopTabs.Screen name="buildings" options={{ title: t("tabs.buildings") }} />
                <TopTabs.Screen name="upgrades" options={{ title: t("tabs.upgrades") }} />
            </TopTabs>
        </View>
    )
}
