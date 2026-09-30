import { useRef } from "react";
import Drawer from "./Drawer";
import Cheats from "./Cheats";
import Text from "../generalUI/Text";
import { useSelector } from 'react-redux';
import { RootState } from "../../scripts/redux/reduxStore";
import { View, Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { palette, radii } from "../misc/theme";

type DrawerRef = {
    openDrawer: () => void;
    closeDrawer: () => void;
};

export default function HomeNavigation() {
    const navigationDrawerRef = useRef<DrawerRef>(null);

    const { funValue } = useSelector((state: RootState) => state.values);

    return (
        <>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Menu"
                onPress={() => navigationDrawerRef.current?.openDrawer()}
                style={({ pressed }) => [styles.menuButton, pressed ? { opacity: 0.7 } : null]}
            >
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round">
                    <Path d="M3 5h14M3 10h14M3 15h9" />
                </Svg>
            </Pressable>
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

const styles = StyleSheet.create({
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
})