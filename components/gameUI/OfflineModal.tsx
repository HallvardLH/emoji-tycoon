import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Modal from "../generalUI/Modal";
import Text from "../generalUI/Text";
import ChunkyButton from "../generalUI/ChunkyButton";
import { palette, radii } from "../misc/theme";
import { formatNumber } from "../../scripts/misc";
import { AD_MULTIPLIER, MAX_AWAY_SECONDS, PREMIUM_COST, PREMIUM_MULTIPLIER, claimOffline, dismissOffline } from "../../scripts/game/offline";
import { spendPremiumCurrency, watchRewardedAd } from "../../scripts/monetization";

/** "2h 5m", "45m" */
function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Welcome back: offers the production missed while away, for watching an ad
 * or spending premium currency (see offline.ts)
 */
export default function OfflineModal() {
    const offer = useSelector((state: RootState) => state.offline.offer);
    // While an ad plays or a payment goes through, so it can't be claimed twice
    const [busy, setBusy] = useState(false);

    if (!offer) return null;

    const missed = offer.eps * offer.seconds;
    const capped = offer.seconds >= MAX_AWAY_SECONDS;

    const claim = async (pay: () => Promise<boolean>, multiplier: number) => {
        if (busy) return;
        setBusy(true);
        try {
            if (await pay()) claimOffline(multiplier);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal modalVisible noExit onRequestClose={() => { if (!busy) dismissOffline(); }}>
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
                    <ChunkyButton
                        label={`📺 +${formatNumber(missed * AD_MULTIPLIER, 1)}`}
                        sublabel="WATCH AN AD"
                        height={56}
                        disabled={busy}
                        onPress={() => claim(watchRewardedAd, AD_MULTIPLIER)}
                    />
                    <ChunkyButton
                        label={`💎 +${formatNumber(missed * PREMIUM_MULTIPLIER, 1)}`}
                        sublabel={`×${PREMIUM_MULTIPLIER} FOR ${PREMIUM_COST} GEMS`}
                        height={56}
                        disabled={busy}
                        onPress={() => claim(() => spendPremiumCurrency(PREMIUM_COST), PREMIUM_MULTIPLIER)}
                    />
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
