import { View } from "react-native";
import HeaderCenter from "./HeaderCenter";
import CircularButton from "../buttons/CircularButton";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StackParamsList } from "../../screens/AppNavigationStack";
import HomeNavigation from "./HomeNavigation";

type HeaderOptionsProps = {
    navigation: NavigationProp<StackParamsList>;
    route: RouteProp<StackParamsList, keyof StackParamsList>;
};

const HeaderOptions = ({ navigation, route }: HeaderOptionsProps) => ({
    headerTransparent: true,
    headerStyle: {
        backgroundColor: "transparent",
        elevation: 0, // for Android
        shadowOpacity: 0, // for iOS
    },
    headerTitle: () => (
        <HeaderCenter />
    ),
    headerTitleAlign: "center" as const, // Explicitly typing as "center"
    headerLeft: (props: any) => {
        const { onPress } = props;  // Extract default onPress
        return (
            <View style={{ marginLeft: 20 }}>
                {route.name == "Home" ? (
                    <HomeNavigation />
                ) : (
                    <CircularButton variant="back" onPress={onPress} />
                )}
            </View>
        )
    },
    headerRight: () => (
        <View style={{ marginRight: 20 }}>

        </View>
    ),
})

export default HeaderOptions