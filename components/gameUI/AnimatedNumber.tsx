import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { formatNumber } from '../../scripts/misc';

interface AnimatedNumberProps {
    value: number;
}

const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
    const animatedValue = useRef(new Animated.Value(value)).current;
    // Use a separate state for the display value if you need to format or round it
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        // Update displayValue directly based on the animated value
        animatedValue.addListener(({ value }) => {
            // Format the display value as needed (e.g., rounding)
            setDisplayValue(formatNumber(Math.floor(value)).toString());
        });

        // Configure the animation
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 100,
            useNativeDriver: false, // If this is true the app gets incredibly slow
            easing: Easing.out(Easing.cubic), // This easing function starts fast and ends slowly
        }).start(() => {
            // Optional: Cleanup listener if needed or perform actions after the animation is complete
        });

        // Cleanup listener on component unmount or value change
        return () => {
            animatedValue.removeAllListeners();
        };
    }, [value, animatedValue]);

    return <Text>{displayValue}</Text>;
};

export default AnimatedNumber;

