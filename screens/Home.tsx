import ScreenView from "../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../components/gameUI/BigEmoji";

interface HomeProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Home({ navigation }: HomeProps) {
    return (
        <ScreenView>
            <BigEmoji />
        </ScreenView>
    )
}