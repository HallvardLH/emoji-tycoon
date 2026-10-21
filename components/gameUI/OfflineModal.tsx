import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "../../scripts/redux/reduxStore";
import Modal from "../generalUI/Modal";
import Text from "../generalUI/Text";
import ChunkyButton from "../generalUI/ChunkyButton";
import { palette, radii } from "../misc/theme";
import { formatDuration, formatNumber } from "../../scripts/misc";
import { AD_MULTIPLIER, GEM_COST, GEM_MULTIPLIER, MAX_AWAY_SECONDS, claimOffline, dismissOffline } from "../../scripts/game/offline";
import { spendGems, useGemStoreOpen, watchRewardedAd } from "../../scripts/monetization";
import { useTranslation } from "react-i18next";
import { toCaps } from "../../scripts/utils";

/**
 * Welcome back: offers the production missed while away, for watching an ad
 * or spending gems (see offline.ts)
 */
export default function OfflineModal() {
    const offer = useSelector((state: RootState) => state.offline.offer);
    const gems = useSelector((state: RootState) => state.gems.gems);
    const router = useRouter();
    // Steps aside while the gem store is open, and is back when it closes
    const inGemStore = useGemStoreOpen();
    // While an ad plays or a payment goes through, so it can't be claimed twice
    const [busy, setBusy] = useState(false);
    // The last ad couldn't be shown (offline, none available) or was closed early
    const [adFailed, setAdFailed] = useState(false);
    const { t } = useTranslation();

    if (!offer || inGemStore) return null;

    const missed = offer.eps * offer.seconds;
    const capped = offer.seconds >= MAX_AWAY_SECONDS;

    const claimWithAd = async () => {
        if (busy) return;
        setBusy(true);
        setAdFailed(false);
        try {
            if (await watchRewardedAd()) claimOffline(AD_MULTIPLIER);
            else setAdFailed(true);
        } finally {
            setBusy(false);
        }
    };

    const canAffordGems = gems >= GEM_COST;
    const claimWithGems = () => {
        if (busy) return;
        if (!canAffordGems) router.push("/gems");
        else if (spendGems(GEM_COST)) claimOffline(GEM_MULTIPLIER);
    };

    return (
        <Modal modalVisible noExit onRequestClose={() => { if (!busy) dismissOffline(); }}>
            <View style={styles.card}>
                <Text size={44} style={styles.icon}>🌙</Text>
                <Text size={28} color={palette.ink} style={styles.center}>{t("offline.welcomeBack")}</Text>
                <Text font="bold" size={14} color={palette.muted} style={styles.center}>
                    {capped
                        ? t("offline.awayCapped", { duration: formatDuration(MAX_AWAY_SECONDS) })
                        : t("offline.away", { duration: formatDuration(offer.seconds) })}
                    {"\n"}{t("offline.rested")}
                </Text>

                <View style={styles.missed}>
                    <Text font="black" size={11} color={palette.muted} style={styles.caption}>{toCaps(t("offline.missedCaps"))}</Text>
                    <Text size={30} color={palette.ink}>{formatNumber(missed, 1)}</Text>
                    <Text font="bold" size={12} color={palette.muted}>{t("offline.perSecond", { value: formatNumber(offer.eps, 1) })}</Text>
                </View>

                <View style={styles.buttons}>
                    <ChunkyButton
                        label={`📺 +${formatNumber(missed * AD_MULTIPLIER, 1)}`}
                        sublabel={busy ? toCaps(t("ads.loadingCaps")) : toCaps(t("ads.watchCaps"))}
                        height={56}
                        disabled={busy}
                        onPress={claimWithAd}
                    />
                    <ChunkyButton
                        label={`💎 +${formatNumber(missed * GEM_MULTIPLIER, 1)}`}
                        sublabel={canAffordGems
                            ? toCaps(t("offline.gemOfferCaps", { multiplier: GEM_MULTIPLIER, cost: GEM_COST, gems: formatNumber(gems) }))
                            : toCaps(t("offline.gemOfferGetCaps", { multiplier: GEM_MULTIPLIER, cost: GEM_COST }))}
                        height={56}
                        disabled={busy}
                        onPress={claimWithGems}
                    />
                    {adFailed && (
                        <Text font="bold" size={13} color={palette.pop} style={styles.center}>
                            {t("ads.failed")}
                        </Text>
                    )}
                    <Pressable
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={dismissOffline}
                        style={({ pressed }) => [styles.noThanks, pressed ? styles.pressed : null]}
                    >
                        <Text font="bold" size={14} color={palette.muted}>{t("offline.noThanks")}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
    missed: {
        alignSelf: "stretch",
        alignItems: "center",
        marginTop: 6,
        paddingVertical: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.tile,
    },
    caption: {
        letterSpacing: 1.2,
    },
    buttons: {
        alignSelf: "stretch",
        gap: 6,
        marginTop: 8,
    },
    noThanks: {
        alignItems: "center",
        paddingVertical: 10,
    },
    pressed: {
        opacity: 0.6,
    },
});
