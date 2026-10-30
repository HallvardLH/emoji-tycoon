import { View } from "react-native";
import { TopTabs } from "expo-router/js-top-tabs";
import TopTabBar from "../../../components/TabBar/TopTabBar";
import { palette } from "../../../components/misc/theme";
import FreezeWhenBlurred from "../../../components/layout/FreezeWhenBlurred";
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
                // Buildings and Upgrades are both mounted; only the one showing re-renders
                screenLayout={({ navigation, children }) => <FreezeWhenBlurred navigation={navigation}>{children}</FreezeWhenBlurred>}
            >
                <TopTabs.Screen name="buildings" options={{ title: t("tabs.buildings") }} />
                <TopTabs.Screen name="upgrades" options={{ title: t("tabs.upgrades") }} />
            </TopTabs>
        </View>
    )
}
