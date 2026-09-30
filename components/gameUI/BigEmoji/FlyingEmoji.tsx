import { StyleSheet, Animated, Platform } from 'react-native';
import React from "react";

interface FlyingEmojiProps {
    emoji: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
}

export const FlyingEmoji = React.memo(({ emoji, xAnim, yAnim }: FlyingEmojiProps) => (
    <Animated.Text
        pointerEvents="none"
        style={[
            styles.bigEmoji,
            {
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: yAnim.interpolate({
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