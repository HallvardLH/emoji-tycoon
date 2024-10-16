import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji";
import EffectMeters from "../../components/gameUI/Meters/EffectMeters";
import EffectPopup from "../../components/gameUI/EffectPopup";
import PrestigeMeter from "../../components/gameUI/Meters/PrestigeMeter";
import { View } from "react-native";

interface HomeProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Home({ navigation }: HomeProps) {
    return (
        <ScreenView>
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