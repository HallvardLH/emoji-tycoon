import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize, useForeground } from "react-native-google-mobile-ads";
import { BANNER_UNIT_ID, adRequestOptions, canRequestAds, onAdChoicesChanged } from "../../scripts/admob";
import { palette, themedStyles } from "../misc/theme";

/**
 * A banner across the screen. Takes up no room until an ad has loaded, and
 * nothing is requested until consent allows it (see admob.ts)
 */
export default function AdMobBanner() {
    const [allowed, setAllowed] = useState(false);
    // A new banner for each consent answer, as the old one was requested under the old answer
    const [answer, setAnswer] = useState(0);
    const banner = useRef<BannerAd>(null);
    const mounted = useRef(true);

    const askConsent = () => {
        canRequestAds()
            .catch(() => false)
            .then(canRequest => {
                if (!mounted.current) return;
                setAllowed(canRequest);
                setAnswer(previous => previous + 1);
            });
    };

    useEffect(() => {
        mounted.current = true;
        askConsent();
        const stopListening = onAdChoicesChanged(askConsent);
        return () => {
            mounted.current = false;
            stopListening();
        };
    }, []);

    useForeground(() => {
        // No answer at the start (offline, say): there may be one now
        if (!allowed) askConsent();
        // iOS can blank a banner while the app is in the background
        else if (Platform.OS === "ios") banner.current?.load();
    });

    if (!allowed) return null;

    return (
        <View style={styles.slot}>
            <BannerAd
                key={answer}
                ref={banner}
                unitId={BANNER_UNIT_ID}
                size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
                requestOptions={adRequestOptions()}
                onAdFailedToLoad={error => console.warn("Banner ad failed to load", error)}
            />
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    slot: {
        alignItems: "center",
        backgroundColor: palette.night,
    },
}));
