import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji";
import EffectBanner from "../../components/gameUI/EffectBanner";
import EffectPopup from "../../components/gameUI/EffectPopup";

interface HomeProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Home({ navigation }: HomeProps) {
    return (
        <ScreenView>
            <EffectBanner />
            <BigEmoji />
            <EffectPopup />
        </ScreenView>
    )
}