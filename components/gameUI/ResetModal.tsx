import { useSyncExternalStore } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import store from "../../scripts/redux/reduxStore";
import { resetValues } from "../../scripts/redux/valuesSlice";
import { resetBuildings } from "../../scripts/redux/buildingsSlice";
import { resetUpgrades } from "../../scripts/redux/upgradesSlice";
import { resetBigEmoji } from "../../scripts/redux/bigEmojiSlice";
import { resetEffects } from "../../scripts/redux/effectsSlice";
import { resetCollection } from "../../scripts/redux/collectionSlice";
import { resetStats } from "../../scripts/redux/statsSlice";
import { resetPrestige } from "../../scripts/redux/prestigeSlice";
import { resetTabs } from "../../scripts/redux/tabsSlice";
import { resetOffline } from "../../scripts/redux/offlineSlice";
import { resetAchievements } from "../../scripts/redux/achievementsSlice";
import { clearWaitingTrophies } from "../../scripts/game/achievements";
import Modal from "../generalUI/Modal";
import Text from "../generalUI/Text";
import { palette, radii, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";

// ---- Whether the confirmation is showing. It lives at the root, not in the drawer
// that opens it, because a modal inside the drawer ends up hidden behind it ----

let open = false;
const listeners = new Set<() => void>();

function setOpen(next: boolean) {
    open = next;
    listeners.forEach(listener => listener());
}

/** Asks the player whether to reset the game */
export function openResetConfirm() {
    setOpen(true);
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

/**
 * Starts the game over. Settings (sound, animations) are kept, as they aren't progress,
 * and so are purchases, which don't live in the save.
 */
function resetGame() {
    store.dispatch(resetValues());
    store.dispatch(resetBuildings());
    store.dispatch(resetUpgrades());
    store.dispatch(resetBigEmoji());
    store.dispatch(resetEffects());
    store.dispatch(resetCollection());
    store.dispatch(resetStats());
    store.dispatch(resetPrestige());
    store.dispatch(resetTabs());
    store.dispatch(resetOffline());
    store.dispatch(resetAchievements());
    clearWaitingTrophies();
}

/** Resetting wipes the save, so it asks first, and says that purchases carry over */
export default function ResetModal() {
    const visible = useSyncExternalStore(subscribe, () => open);
    const close = () => setOpen(false);
    const { t } = useTranslation();

    return (
        <Modal modalVisible={visible} noExit onRequestClose={close}>
            <View style={styles.card}>
                <Text size={44} style={styles.icon}>⚠️</Text>
                <Text size={28} color={palette.ink} style={styles.center}>{t("reset.title")}</Text>
                <Text font="bold" size={14} color={palette.muted} style={styles.center}>
                    {t("reset.warning")}
                </Text>

                <View style={styles.kept}>
                    <Text size={22} style={{ lineHeight: 28 }}>💎</Text>
                    <Text font="bold" size={13} color={palette.greenText} style={styles.keptText}>
                        {t("reset.purchasesSafe")}
                    </Text>
                </View>

                <View style={styles.buttons}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => { close(); resetGame(); }}
                        style={({ pressed }) => [styles.confirm, pressed ? styles.pressed : null]}
                    >
                        <Text font="black" size={16} color="#FFFFFF">{t("reset.confirm")}</Text>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        onPress={close}
                        style={({ pressed }) => [styles.cancel, pressed ? styles.pressed : null]}
                    >
                        <Text font="bold" size={14} color={palette.muted}>{t("reset.cancel")}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    card: {
        alignSelf: "stretch",
        maxWidth: 400,
        width: "100%",
        marginHorizontal: "auto",
        padding: 20,
        gap: 8,
        alignItems: "center",
        borderRadius: radii.xl,
        backgroundColor: palette.paper,
    },
    icon: {
        lineHeight: 52,
    },
    center: {
        textAlign: "center",
    },
    kept: {
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 6,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.mint,
    },
    keptText: {
        flex: 1,
    },
    buttons: {
        alignSelf: "stretch",
        gap: 6,
        marginTop: 8,
    },
    confirm: {
        minHeight: 52,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radii.md,
        backgroundColor: palette.pop,
    },
    cancel: {
        alignItems: "center",
        paddingVertical: 10,
    },
    pressed: {
        opacity: 0.7,
    },
}));
