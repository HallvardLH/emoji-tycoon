import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji/BigEmoji";
import EffectMeters from "../../components/gameUI/Meters/EffectMeters";
import EffectPopup from "../../components/gameUI/EffectPopup";
import { View, StyleSheet } from "react-native";

export default function Home() {
    return (
        <ScreenView scrollView={false}>
            {/* <EmojiRain delay={1000} /> */}
            <BigEmoji />
            {/* Floats over the stage so chips appearing don't shift the Big Emoji */}
            <View style={styles.overlay} pointerEvents="box-none">
                <EffectMeters />
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
})
