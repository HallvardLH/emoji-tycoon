import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import Text from '../generalUI/Text';
import { formatNumber } from '../../scripts/misc';

interface EpsAmountProps {
    fontSize?: number;
}

export default function EpsAmount({ fontSize = 20 }: EpsAmountProps) {
    const { emojisPerSecond } = useSelector((state: RootState) => state.values);

    return (
        <Text style={{ fontSize: fontSize }}>Per second: {formatNumber(emojisPerSecond)}</Text>
    )
}