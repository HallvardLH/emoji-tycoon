import { StyleSheet, Animated } from "react-native";
import React from "react";
import { fonts } from "../../misc/theme";

interface FlyingNumberProps {
    number: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
    color?: string;
    size?: number;
}

export const FlyingNumber = React.memo(({ number, xAnim, yAnim, color = "#FFFFFF", size = 26 }: FlyingNumberProps) => (
    <Animated.Text
        pointerEvents="none"
        style={[
            styles.number,
            {
                color,
                fontSize: size,
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: yAnim.interpolate({
                    inputRange: [-220, -110, 0],
                    outputRange: [0, 0.6, 1],
                }),
            },
        ]}
    >
        {number}
    </Animated.Text>
));

const styles = StyleSheet.create({
    number: {
        fontFamily: fonts.display,
        position: 'absolute',
        textShadowColor: "rgba(0, 0, 0, 0.35)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    },
});
