import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import Text from '../generalUI/Text';
import AnimatedNumber from './AnimatedNumber';

interface EmojisAmountProps {
    fontSize: number;
}

export default function EmojisAmount({ fontSize = 20 }: EmojisAmountProps) {

    const { emojis } = useSelector((state: RootState) => state.values);

    return (
        <Text style={{ fontSize: fontSize }}><AnimatedNumber value={emojis} /></Text>
    )
}