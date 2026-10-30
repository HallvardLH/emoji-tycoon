import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji/BigEmoji";
import EffectMeters from "../../components/gameUI/Meters/EffectMeters";
import EffectPopup from "../../components/gameUI/EffectPopup";
import FirstRunHint from "../../components/gameUI/FirstRunHint";
import BoostButton from "../../components/gems/BoostButton";
import EmojiRain from "../../components/gameUI/EmojiRain";
import { View, StyleSheet } from "react-native";

export default function Home() {
    return (
        <ScreenView scrollView={false}>
            {/* Behind everything, filling the stage */}
            <EmojiRain />
            <BigEmoji />
            {/* Floats over the stage so chips appearing don't shift the Big Emoji */}
            <View style={styles.overlay} pointerEvents="box-none">
                <EffectMeters />
            </View>
            {/* A new game's first steps, under the Big Emoji */}
            <View style={styles.hint} pointerEvents="none">
                <FirstRunHint />
            </View>
            {/* Gem powers, bottom left (under effect emojis, which can land anywhere) */}
            <View style={styles.boost}>
                <BoostButton />
            </View>
            <EffectPopup />
        </ScreenView>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 12,
        left: 20,
        right: 20,
        flexDirection: "row",
    },
    hint: {
        position: "absolute",
        bottom: 28,
        left: 20,
        right: 20,
    },
    boost: {
        position: "absolute",
        bottom: 16,
        left: 16,
    },
})
