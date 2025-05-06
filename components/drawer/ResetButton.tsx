import { useDispatch } from 'react-redux';
import { resetValues } from '../../scripts/redux/valuesSlice';
import { resetBuildings } from '../../scripts/redux/buildingsSlice';
import { resetUpgrades } from '../../scripts/redux/upgradesSlice';
import { resetBigEmoji } from '../../scripts/redux/bigEmojiSlice';
import { resetEffects } from '../../scripts/redux/effectsSlice';
import { resetCollection } from '../../scripts/redux/collectionSlice';
import { resetPreferences } from '../../scripts/redux/preferencesSlice';
import { resetStats } from '../../scripts/redux/statsSlice';
import { resetPrestige } from '../../scripts/redux/prestigeSlice';
import { resetTabs } from '../../scripts/redux/tabsSlice';
import Button from '../buttons/Button';

interface ResetButtonProps {
    onPress?: () => void;
}

export default function ResetButton({ onPress }: ResetButtonProps) {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetValues());
        dispatch(resetBuildings());
        dispatch(resetUpgrades());
        dispatch(resetBigEmoji());
        dispatch(resetEffects());
        dispatch(resetCollection());
        dispatch(resetPreferences());
        dispatch(resetStats());
        dispatch(resetPrestige());
        dispatch(resetTabs());
    };
    return (
        <Button variant="blue" width={200} label="Reset game" onPress={() => {
            handleReset();
            if (onPress) {
                onPress();
            }
        }} />
    )
}