import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { formatNumber } from '../../scripts/misc';

interface AnimatedNumberProps {
    value: number;
}

/**
 * A formatted, whole number that updates as its value changes.
 *
 * This used to tween between values with a JS-driven animation that set React state
 * on every frame (~60 renders a second for the bank). The bank already updates on
 * every game tick (10 times a second), which reads as a lively counter on its own.
 * React skips the text update entirely when the formatted string is unchanged.
 */
const AnimatedNumber = React.memo(({ value }: AnimatedNumberProps) => {
    const display = useMemo(() => formatNumber(Math.floor(value)), [value]);
    return <Text>{display}</Text>;
});

export default AnimatedNumber;
