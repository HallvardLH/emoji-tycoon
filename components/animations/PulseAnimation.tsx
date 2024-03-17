import { ReactNode, useRef, useEffect } from "react";
import { Animated } from "react-native";

interface PulseAnimationProps {
    children: ReactNode;
    duration?: number;
    minSize?: number;
    maxSize?: number;
}

export default function PulseAnimation({ children, duration = 4000, minSize = 1, maxSize = 1.075 }: PulseAnimationProps) {
    const pulseAnim = useRef(new Animated.Value(minSize)).current;

    useEffect(() => {
        Animated.loop(
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
        ).start();
    }, [pulseAnim]);

    return (
        <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, { alignItems: "center", justifyContent: "center" }]}>
            {children}
        </Animated.View>
    )
}
