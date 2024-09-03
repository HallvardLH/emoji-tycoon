import React, { ReactNode, useRef, useEffect } from "react";
import { Animated } from "react-native";

interface PulseAnimationProps {
    children: ReactNode;
    duration?: number;
    minSize?: number;
    maxSize?: number;
}

const PulseAnimation = React.memo(({ children, duration = 4000, minSize = 1, maxSize = 1.075 }: PulseAnimationProps) => {
    const pulseAnim = useRef(new Animated.Value(minSize)).current;

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: maxSize,
                    duration: duration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: minSize,
                    duration: duration / 2,
                    useNativeDriver: true,
                })
            ])
        );
        pulseAnimation.start();

        // Cleanup on unmount
        return () => pulseAnimation.stop();
    }, [minSize, maxSize, duration]);

    return (
        <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, { alignItems: "center", justifyContent: "center" }]}>
            {children}
        </Animated.View>
    );
});

export default PulseAnimation;
