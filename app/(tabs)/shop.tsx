import { View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpgradesTab from "./shop/upgrades";
import BuildingsTab from "./shop/buildings";
import TopTabBar from "../../components/TabBar/TopTabBar";
import { palette } from "../../components/misc/theme";

const Tab = createMaterialTopTabNavigator();

export default function Buildings() {
    return (
        <View style={{ flex: 1, backgroundColor: palette.grape }}>
            <Tab.Navigator
                tabBar={(props) => <TopTabBar {...props} />}
                screenOptions={{ sceneStyle: { backgroundColor: palette.grape } }}
            >
                <Tab.Screen name="Buildings" component={BuildingsTab} />
                <Tab.Screen name="Upgrades" component={UpgradesTab} />
            </Tab.Navigator>
        </View>
    )
}