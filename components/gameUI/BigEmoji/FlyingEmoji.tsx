import { StyleSheet, Animated, Platform } from 'react-native';
import React from "react";

interface FlyingEmojiProps {
    emoji: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
    /** Low gravity: the emoji rises (y goes negative) and fades as it floats away */
    floatUp?: boolean;
}

export const FlyingEmoji = React.memo(({ emoji, xAnim, yAnim, floatUp = false }: FlyingEmojiProps) => (
    <Animated.Text
        pointerEvents="none"
        style={[
            styles.bigEmoji,
            {
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: floatUp
                    ? yAnim.interpolate({
                        inputRange: [-260, -120, 0],
                        outputRange: [0, 0.6, 1],
                    })
                    : yAnim.interpolate({
                        inputRange: [0, 30, 100],
                        outputRange: [1, 0.7, 0],
                    }),
            },
        ]}
    >
        {emoji}
    </Animated.Text>
));

const styles = StyleSheet.create({
    bigEmoji: {
        // Matches the Big Emoji so it looks like the same emoji flying off
        fontSize: Platform.OS == "android" ? 130 : 150,
        lineHeight: Platform.OS == "android" ? 150 : 175,
        position: 'absolute',
    },
});
