import { ScrollView, StyleSheet, View } from "react-native";
import UpgradesTab from "../../app/(tabs)/shop/upgrades";
import BuildingsTab from "../../app/(tabs)/shop/buildings";
import Home from "../../app/(tabs)/index";
import Emojidex from "../../app/(tabs)/emojidex";
import Settings from "../drawer/Settings";
import SegmentedControl from "../generalUI/SegmentedControl";
import { StageHeader } from "../header/Header";
import { palette, themedStyles } from "../misc/theme";
import { DesktopPanel, setDesktopPanel, useDesktopPanel } from "./desktop";
import { useTranslation } from "react-i18next";

const PANELS: { panel: DesktopPanel, labelKey: string }[] = [
    { panel: "buildings", labelKey: "tabs.buildings" },
    { panel: "emojidex", labelKey: "tabs.emojidex" },
    { panel: "settings", labelKey: "settings.title" },
];

/**
 * The desktop layout (see desktop.ts), a third of the window each: upgrades on the
 * left, the Big Emoji with the bank above it in the middle, and on the right the
 * buildings, the Emojidex or the settings, picked in its navbar.
 */
export default function DesktopLayout() {
    const panel = useDesktopPanel();
    const { t } = useTranslation();

    return (
        <View style={styles.row}>
            <View style={styles.column}>
                <UpgradesTab />
            </View>
            <View style={[styles.column, styles.middle]}>
                <StageHeader />
                <View style={styles.stage}>
                    <Home />
                </View>
            </View>
            <View style={styles.column}>
                <View style={styles.navbar}>
                    <SegmentedControl
                        activeIndex={PANELS.findIndex(p => p.panel === panel)}
                        segments={PANELS.map(p => ({ label: t(p.labelKey), onPress: () => setDesktopPanel(p.panel) }))}
                    />
                </View>
                <View style={styles.stage}>
                    {panel === "buildings" ? <BuildingsTab /> : panel === "emojidex" ? <Emojidex /> : (
                        <ScrollView contentContainerStyle={styles.settings}>
                            <Settings />
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: palette.grape,
    },
    column: {
        flex: 1,
        // Lets a column shrink to its third instead of growing with wide content
        minWidth: 0,
        overflow: "hidden",
    },
    middle: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: palette.glassLine,
    },
    stage: {
        flex: 1,
    },
    navbar: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 4,
    },
    settings: {
        paddingTop: 16,
        paddingBottom: 20,
    },
}));
