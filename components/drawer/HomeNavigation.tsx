import { useRef } from "react";
import CircularButton from "../buttons/CircularButton";
import Drawer from "./Drawer";
import DrawerLink from "./DrawerLink";
import ResetButton from "./ResetButton";
import Cheats from "./Cheats";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { View } from "react-native";

type DrawerRef = {
    openDrawer: () => void;
    closeDrawer: () => void;
};

export default function HomeNavigation() {
    const navigationDrawerRef = useRef<DrawerRef>(null);

    const { funValue } = useSelector((state: RootState) => state.values);

    return (
        <>
            <CircularButton variant="hamburger" onPress={() => navigationDrawerRef.current?.openDrawer()} />
            <Drawer
                ref={navigationDrawerRef}
                side="left"
            >
                <View style={{
                    alignItems: "center",
                    flex: 1,
                    gap: 10,
                    // justifyContent: "center",
                    marginTop: "30%"
                }}>
                    <Cheats onPress={() => navigationDrawerRef.current?.closeDrawer()} />
                    <Text>Fun value: {funValue}</Text>
                    {/* <DrawerLink
                    text="Notifications"
                    linkTo="Notifications"
                    onPress={() => navigationDrawerRef.current?.closeDrawer()}
                /> */}
                </View>
            </Drawer>
        </>
    )
}