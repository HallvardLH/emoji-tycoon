import { createStackNavigator } from "@react-navigation/stack";
import HeaderOptions from "../components/header/HeaderOptions";
import Home from "./Home/Home";
import Shop from "./Shop/Shop";
import Collection from "./Collection/Collection";
import Settings from "./Settings/Settings";

export type StackParamsList = {
    Home: undefined;
    Shop: undefined;
    Collection: undefined;
    Settings: undefined;
}

const Stack = createStackNavigator<StackParamsList>();

export default function AppNavigationStack() {

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Shop"
                component={Shop}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Collection"
                component={Collection}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={({ navigation, route }) => HeaderOptions({ navigation, route })}
            />
        </Stack.Navigator>
    )
}