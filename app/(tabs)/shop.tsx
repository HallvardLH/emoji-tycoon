import { View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpgradesTab from "./shop/upgrades";
import BuildingsTab from "./shop/buildings";
import TopTabBar from "../../components/TabBar/TopTabBar";
import { palette } from "../../components/misc/theme";
import FreezeWhenBlurred from "../../components/layout/FreezeWhenBlurred";
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();

export default function Buildings() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, backgroundColor: palette.grape }}>
            <Tab.Navigator
                tabBar={(props) => <TopTabBar {...props} />}
                screenOptions={{ sceneStyle: { backgroundColor: palette.grape } }}
                // Buildings and Upgrades are both mounted; only the one showing re-renders
                screenLayout={({ navigation, children }) => <FreezeWhenBlurred navigation={navigation}>{children}</FreezeWhenBlurred>}
            >
                <Tab.Screen name="Buildings" component={BuildingsTab} options={{ title: t("tabs.buildings") }} />
                <Tab.Screen name="Upgrades" component={UpgradesTab} options={{ title: t("tabs.upgrades") }} />
            </Tab.Navigator>
        </View>
    )
}