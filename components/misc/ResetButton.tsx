import { useDispatch } from 'react-redux';
import { resetState } from '../../scripts/redux/valuesSlice';
import Button from '../buttons/Button';

interface ResetButtonProps {
    onPress: () => void;
}

export default function ResetButton({ onPress }: ResetButtonProps) {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetState());
    };
    return (
        <Button label="Reset game" onPress={() => {
            handleReset();
            onPress()
        }} />
    )
}