import { ReactNode, useRef } from "react";
import Drawer from "./Drawer";
import Cheats from "./Cheats";
import Settings from "./Settings";
import { ScrollView, Pressable, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Text from "../generalUI/Text";
import { palette, radii, themedStyles } from "../misc/theme";
import { toggleDesktopSettings, useDesktopPanel, useIsDesktop } from "../layout/desktop";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import { formatNumber } from "../../scripts/misc";

type DrawerRef = {
    openDrawer: () => void;
    closeDrawer: () => void;
};

/**
 * The header's top-right buttons: cheats (for testing, development builds only) and the menu (settings for now), each
 * opening a drawer. On desktop the menu swaps the Emojidex column for the settings instead.
 */
export default function HomeNavigation() {
    const cheatsDrawerRef = useRef<DrawerRef>(null);
    const settingsDrawerRef = useRef<DrawerRef>(null);
    const isDesktop = useIsDesktop();
    const panel = useDesktopPanel();
    const { t } = useTranslation();

    return (
        <View style={styles.buttons}>
            {/* Cheats are for testing: development builds only, never in a release */}
            {__DEV__ && (
                <HeaderButton label={t("drawer.cheats")} onPress={() => cheatsDrawerRef.current?.openDrawer()}>
                    <Text size={18} style={{ lineHeight: 24 }}>🧪</Text>
                </HeaderButton>
            )}
            <HeaderButton label={t("gems.openStoreA11y")} onPress={() => router.push("/gems")}>
                <Text size={18} style={{ lineHeight: 24 }}>💎</Text>
            </HeaderButton>
            {/* A plain menu icon, so the drawer can hold more than settings later.
                On desktop the settings open where the Emojidex is, not in a drawer */}
            <HeaderButton
                label={isDesktop && panel === "settings" ? t("settings.close") : t("drawer.menu")}
                active={isDesktop && panel === "settings"}
                onPress={() => isDesktop ? toggleDesktopSettings() : settingsDrawerRef.current?.openDrawer()}
            >
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round">
                    <Path d="M3 5h14M3 10h14M3 15h9" />
                </Svg>
            </HeaderButton>

            {__DEV__ && (
                <Drawer ref={cheatsDrawerRef} side="left">
                    <ScrollView contentContainerStyle={styles.drawerContent}>
                        <Cheats onPress={() => cheatsDrawerRef.current?.closeDrawer()} />
                    </ScrollView>
                </Drawer>
            )}
            <Drawer ref={settingsDrawerRef} side="right">
                <ScrollView contentContainerStyle={styles.drawerContent}>
                    <GemStoreCard onPress={() => { settingsDrawerRef.current?.closeDrawer(); router.push("/gems"); }} />
                    <Settings onReset={() => settingsDrawerRef.current?.closeDrawer()} />
                </ScrollView>
            </Drawer>
        </View>
    )
}

/** The gem store, first thing in the menu */
function GemStoreCard({ onPress }: { onPress: () => void }) {
    const { t } = useTranslation();
    const gems = useSelector((state: RootState) => state.gems.gems);
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={t("gems.storeCardA11y", { gems: formatNumber(gems) })}
            style={({ pressed }) => [styles.gemCard, pressed ? { opacity: 0.85 } : null]}
        >
            <Text size={34} style={{ lineHeight: 40 }}>💎</Text>
            <View style={{ flex: 1, gap: 2 }}>
                <Text size={20} color={palette.ink}>{t("gems.title")}</Text>
                <Text font="bold" size={13} color={palette.muted}>{t("gems.storeCardSubtitle", { gems: formatNumber(gems) })}</Text>
            </View>
            <Text size={22} color={palette.violetDeep}>›</Text>
        </Pressable>
    );
}

function HeaderButton({ label, onPress, active, children }: { label: string, onPress: () => void, active?: boolean, children: ReactNode }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={onPress}
            style={({ pressed }) => [styles.button, active ? styles.buttonActive : null, pressed ? { opacity: 0.7 } : null]}
        >
            {children}
        </Pressable>
    );
}

const styles = themedStyles(() => StyleSheet.create({
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
    buttonActive: {
        backgroundColor: palette.violet,
    },
    drawerContent: {
        paddingTop: 48,
        paddingBottom: 40,
    },
    gemCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 14,
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
        borderWidth: 3,
        borderColor: palette.sun,
    },
}))
