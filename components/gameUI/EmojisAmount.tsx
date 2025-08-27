import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import Text from '../generalUI/Text';
import AnimatedNumber from './AnimatedNumber';
import React, { useMemo } from 'react';

interface EmojisAmountProps {
    fontSize: number;
}

export default React.memo(function EmojisAmount({ fontSize = 20 }: EmojisAmountProps) {
    const emojis = useSelector((state: RootState) => state.values.emojis);

    const textStyle = useMemo(() => ({ fontSize }), [fontSize]);

    return (
        <Text style={textStyle}>
            <AnimatedNumber value={emojis} />
        </Text>
    );
});
