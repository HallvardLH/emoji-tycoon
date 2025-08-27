import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import Text from '../generalUI/Text';
import { formatNumber } from '../../scripts/misc';
import React, { useMemo } from 'react';

interface EpsAmountProps {
    fontSize?: number;
}

export default function EpsAmount({ fontSize = 20 }: EpsAmountProps) {
    const emojisPerSecond = useSelector((state: RootState) => state.values.emojisPerSecond);

    const formattedValue = useMemo(() =>
        formatNumber(emojisPerSecond, 1),
        [emojisPerSecond]
    );

    const textStyle = useMemo(() => ({ fontSize }), [fontSize]);

    return (
        <Text style={textStyle}>Per second: {formattedValue}</Text>
    );
}