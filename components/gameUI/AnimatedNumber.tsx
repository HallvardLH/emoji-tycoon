import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { formatNumber } from '../../scripts/misc';

interface AnimatedNumberProps {
    value: number;
}

const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
    const animatedValue = useRef(new Animated.Value(value)).current;
    const [displayValue, setDisplayValue] = useState(formatNumber(value));
    const previousValue = useRef(value);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const formatDisplayValue = useCallback((num: number) => {
        return formatNumber(Math.floor(num));
    }, []);

    useEffect(() => {
        const listenerId = animatedValue.addListener(({ value }) => {
            setDisplayValue(formatDisplayValue(value));
        });

        return () => {
            animatedValue.removeListener(listenerId);
        };
    }, [animatedValue, formatDisplayValue]);

    useEffect(() => {
        if (value !== previousValue.current) {
            // Stop any ongoing animation
            if (animationRef.current) {
                animationRef.current.stop();
            }

            animationRef.current = Animated.timing(animatedValue, {
                toValue: value,
                duration: 100,
                useNativeDriver: false,
                easing: Easing.out(Easing.cubic),
            });

            animationRef.current.start(() => {
                animationRef.current = null;
            });

            previousValue.current = value;
        }
    }, [value, animatedValue]);

    return <Text>{displayValue}</Text>;
};

export default AnimatedNumber;