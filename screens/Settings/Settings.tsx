import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';

interface SettingsProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Settings({ navigation }: SettingsProps) {
    const { notifications } = useSelector((state: RootState) => state.upgrades);
    return (
        <ScreenView>

        </ScreenView>
    )

}