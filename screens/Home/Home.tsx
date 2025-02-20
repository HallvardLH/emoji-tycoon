import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji";
import EffectMeters from "../../components/gameUI/Meters/EffectMeters";
import EffectPopup from "../../components/gameUI/EffectPopup";
import PrestigeMeter from "../../components/gameUI/Meters/PrestigeMeter";
import { View } from "react-native";
import EmojiRain from "../../components/gameUI/EmojiRain";

interface HomeProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Home({ navigation }: HomeProps) {
    return (
        <ScreenView>
            {/* <EmojiRain bg="#faba2f" delay={7500} />
            <EmojiRain bg="#c5075c" delay={2500} /> */}
            <EmojiRain delay={7500} />
            <EmojiRain delay={2500} />
            <View style={{
                flexDirection: "row",
                position: "absolute",
                top: 0,
                width: "90%",
                justifyContent: "space-between",
            }}>
                <EffectMeters />

                <View>
                    <PrestigeMeter />

                </View>

            </View>
            <BigEmoji />
            <EffectPopup />
        </ScreenView>
    )
}