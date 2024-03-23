import { useDispatch } from 'react-redux';
import { resetValues } from '../../scripts/redux/valuesSlice';
import { resetBuildings } from '../../scripts/redux/buildingsSlice';
import Button from '../buttons/Button';

interface ResetButtonProps {
    onPress: () => void;
}

export default function ResetButton({ onPress }: ResetButtonProps) {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetValues());
        dispatch(resetBuildings());
    };
    return (
        <Button label="Reset game" onPress={() => {
            handleReset();
            onPress()
        }} />
    )
}