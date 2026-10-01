import { ReactNode, useRef } from "react";
import Drawer from "./Drawer";
import Cheats from "./Cheats";
import Settings from "./Settings";
import { ScrollView, Pressable, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Text from "../generalUI/Text";
import { palette, radii } from "../misc/theme";

type DrawerRef = {
    openDrawer: () => void;
    closeDrawer: () => void;
};

/** The header's top-right buttons: cheats (for testing) and the menu (settings for now), each opening a drawer */
export default function HomeNavigation() {
    const cheatsDrawerRef = useRef<DrawerRef>(null);
    const settingsDrawerRef = useRef<DrawerRef>(null);

    return (
        <View style={styles.buttons}>
            <HeaderButton label="Cheats" onPress={() => cheatsDrawerRef.current?.openDrawer()}>
                <Text size={18} style={{ lineHeight: 24 }}>🧪</Text>
            </HeaderButton>
            {/* A plain menu icon, so the drawer can hold more than settings later */}
            <HeaderButton label="Menu" onPress={() => settingsDrawerRef.current?.openDrawer()}>
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round">
                    <Path d="M3 5h14M3 10h14M3 15h9" />
                </Svg>
            </HeaderButton>

            <Drawer ref={cheatsDrawerRef} side="left">
                <ScrollView contentContainerStyle={styles.drawerContent}>
                    <Cheats onPress={() => cheatsDrawerRef.current?.closeDrawer()} />
                </ScrollView>
            </Drawer>
            <Drawer ref={settingsDrawerRef} side="right">
                <ScrollView contentContainerStyle={styles.drawerContent}>
                    <Settings />
                </ScrollView>
            </Drawer>
        </View>
    )
}

function HeaderButton({ label, onPress, children }: { label: string, onPress: () => void, children: ReactNode }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            style={({ pressed }) => [styles.button, pressed ? { opacity: 0.7 } : null]}
        >
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: "row",
        gap: 8,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    drawerContent: {
        paddingTop: 48,
        paddingBottom: 40,
    },
})
