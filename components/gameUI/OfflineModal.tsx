import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { RootState } from "../../scripts/redux/reduxStore";
import Modal from "../generalUI/Modal";
import Text from "../generalUI/Text";
import ChunkyButton from "../generalUI/ChunkyButton";
import { palette, radii, themedStyles } from "../misc/theme";
import { formatDuration, formatNumber } from "../../scripts/misc";
import { AD_MULTIPLIER, GEM_COST, GEM_MULTIPLIER, MAX_AWAY_SECONDS, claimOffline, dismissOffline } from "../../scripts/game/offline";
import { ADS_ENABLED, spendGems, useGemStoreOpen, watchRewardedAd } from "../../scripts/monetization";

/**
 * Welcome back: offers the production missed while away, for watching an ad
 * (while ads are enabled) or spending gems (see offline.ts)
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

    // Offers saved with no production (before that was ruled out in registerAway) are worth nothing
    if (!offer || inGemStore || !(offer.eps > 0)) return null;

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

    // Android's back button and taps outside the card do nothing here: one stray press
    // threw the earnings away. Only "No thanks" dismisses them
    return (
        <Modal modalVisible noExit onRequestClose={() => {}}>
            <View style={styles.card}>
                <Text size={44} style={styles.icon}>🌙</Text>
                <Text size={28} color={palette.ink} style={styles.center}>Welcome back!</Text>
                <Text font="bold" size={14} color={palette.muted} style={styles.center}>
                    {capped
                        ? `You were away for over ${formatDuration(MAX_AWAY_SECONDS)}, the most that counts.`
                        : `You were away for ${formatDuration(offer.seconds)}.`}
                    {"\n"}Your empire rested while you were gone.
                </Text>

                <View style={styles.missed}>
                    <Text font="black" size={11} color={palette.muted} style={styles.caption}>MISSED PRODUCTION</Text>
                    <Text size={30} color={palette.ink}>{formatNumber(missed, 1)}</Text>
                    <Text font="bold" size={12} color={palette.muted}>{formatNumber(offer.eps, 1)} / sec</Text>
                </View>

                <View style={styles.buttons}>
                    {ADS_ENABLED && (
                        <ChunkyButton
                            label={`📺 +${formatNumber(missed * AD_MULTIPLIER, 1)}`}
                            sublabel={busy ? "LOADING AD…" : "WATCH AN AD"}
                            height={56}
                            disabled={busy}
                            onPress={claimWithAd}
                        />
                    )}
                    <ChunkyButton
                        label={`💎 +${formatNumber(missed * GEM_MULTIPLIER, 1)}`}
                        sublabel={canAffordGems
                            ? `×${GEM_MULTIPLIER} FOR ${GEM_COST} GEMS · YOU HAVE ${formatNumber(gems)}`
                            : `×${GEM_MULTIPLIER} FOR ${GEM_COST} GEMS · GET GEMS`}
                        height={56}
                        disabled={busy}
                        onPress={claimWithGems}
                    />
                    {adFailed && (
                        <Text font="bold" size={13} color={palette.pop} style={styles.center}>
                            The ad didn't play to the end. Check your connection and try again.
                        </Text>
                    )}
                    <Pressable
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={dismissOffline}
                        style={({ pressed }) => [styles.noThanks, pressed ? styles.pressed : null]}
                    >
                        <Text font="bold" size={14} color={palette.muted}>No thanks</Text>
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
}));
