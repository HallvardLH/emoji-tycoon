import { createStackNavigator } from "@react-navigation/stack";
import HeaderOptions from "../components/header/HeaderOptions";
import Home from "./Home";
import Shop from "./Shop";

export type StackParamsList = {
    Home: undefined;
    Shop: undefined;
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
        </Stack.Navigator>
    )
}