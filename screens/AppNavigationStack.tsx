import { createStackNavigator } from "@react-navigation/stack";
import HeaderOptions from "../components/header/HeaderOptions";
import Home from "./Home/Home";
import Buildings from "./Buildings/Buildings";
import Emojidex from "./Emojidex/Emojidex";
import Upgrades from "./Upgrades/Upgrades";

export type StackParamsList = {
    Emoji: undefined;
    Buildings: undefined;
    Upgrades: undefined;
    Emojidex: undefined;
}

const Stack = createStackNavigator<StackParamsList>();

export default function AppNavigationStack() {

    return (
        <Stack.Navigator initialRouteName="Emoji">
            <Stack.Screen
                name="Emoji"
                component={Home}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Buildings"
                component={Buildings}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Emojidex"
                component={Emojidex}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Upgrades"
                component={Upgrades}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
        </Stack.Navigator>
    )
}