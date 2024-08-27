import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, Animated, View, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { tapEmoji, pickNextEmoji } from '../../scripts/game/bigEmoji';
import PulseAnimation from '../animations/PulseAnimation';
import { useFonts } from "expo-font";

interface AnimatedEmoji {
    key: string;
    emoji: string;
    yAnimValue: Animated.Value;
    xAnimValue: Animated.Value;
}

interface AnimatedNumber {
    key: string;
    number: string;
    yAnimValue: Animated.Value;
    xAnimValue: Animated.Value;
}

export default function BigEmoji() {
    const { bigEmoji, nextEmoji, emojisPerTap } = useSelector((state: RootState) => state.bigEmoji);

    // Necssary for using font
    useFonts({
        "Digitalt": require("../../assets/fonts/Digitalt.otf"),
    });

    // State for the currently displayed static emoji
    const [staticEmoji, setStaticEmoji] = useState<string>(bigEmoji);

    const [emojisPerTapDisplay, setEmojisPerTapDisplay] = useState<number>(emojisPerTap);

    // State to keep track of multiple animating emojis and numbers
    const [animatingEmojis, setAnimatingEmojis] = useState<AnimatedEmoji[]>([]);
    const [animatingNumbers, setAnimatingNumbers] = useState<AnimatedNumber[]>([]);

    useEffect(() => {
        setEmojisPerTapDisplay(emojisPerTap);
    }, [emojisPerTap]);

    const onEmojiTap = () => {
        const animatingEmoji = staticEmoji;
        pickNextEmoji();
        setStaticEmoji(nextEmoji);
        // setEmojisPerTapDisplay(emojisPerTap);

        // Create new animated values for the animating emoji and number
        const newYAnimValue = new Animated.Value(0);
        const newXAnimValue = new Animated.Value(0);
        const numberYAnimValue = new Animated.Value(0);
        const numberXAnimValue = new Animated.Value(0);

        // Random horizontal target value between -200 and 200 for emoji
        const randomXToValueEmoji = Math.floor(Math.random() * 401) - 200;

        // Random movement for number
        const randomYToValueNumber = -(Math.floor(Math.random() * 111) + 110);
        const randomXToValueNumber = Math.floor(Math.random() * 101) - 50;

        // Generate a unique key for the animating emoji and number using the current timestamp
        const uniqueKey = `${nextEmoji}-${Date.now()}`;

        // Add the animating emoji and number to the state
        const newAnimatingEmoji = {
            key: uniqueKey,
            emoji: animatingEmoji,
            yAnimValue: newYAnimValue,
            xAnimValue: newXAnimValue,
        };
        const newAnimatingNumber = {
            key: `${uniqueKey}-num`,
            number: `+${emojisPerTapDisplay}`,
            yAnimValue: numberYAnimValue,
            xAnimValue: numberXAnimValue,
        };
        setAnimatingEmojis(current => [...current, newAnimatingEmoji]);
        setAnimatingNumbers(current => [...current, newAnimatingNumber]);

        Animated.parallel([
            // Emoji animations
            Animated.sequence([
                Animated.timing(newYAnimValue, {
                    toValue: -30,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(newYAnimValue, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(newXAnimValue, {
                toValue: randomXToValueEmoji,
                duration: 300,
                useNativeDriver: true,
            }),
            // Number animations
            Animated.timing(numberYAnimValue, {
                toValue: randomYToValueNumber,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(numberXAnimValue, {
                toValue: randomXToValueNumber,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
        ]).start(() => {
            // Clean up after animations complete
            setAnimatingEmojis(current => current.filter(item => item.key !== uniqueKey));
            setAnimatingNumbers(current => current.filter(item => item.key !== `${uniqueKey}-num`));
        });


        tapEmoji();
    };

    return (
        <Pressable onPress={onEmojiTap} style={styles.container}>
            <View style={styles.container}>
                {/* Static Emoji */}
                <PulseAnimation maxSize={1.06} duration={5000}>
                    <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                </PulseAnimation>
                {/* Animating Emojis */}
                {animatingEmojis.map(({ key, emoji, yAnimValue, xAnimValue }) => (
                    <Animated.Text
                        key={key}
                        style={[
                            styles.bigEmoji,
                            {
                                transform: [{ translateY: yAnimValue }, { translateX: xAnimValue }],
                                opacity: yAnimValue.interpolate({
                                    inputRange: [0, 30, 100],
                                    outputRange: [1, 0.7, 0],
                                }),
                            },
                        ]}
                    >
                        {emoji}
                    </Animated.Text>
                ))}
                {/* Animating Numbers */}
                {animatingNumbers.map(({ key, number, yAnimValue, xAnimValue }) => (
                    <Animated.Text
                        key={key}
                        style={[
                            styles.number,
                            {
                                transform: [{ translateY: yAnimValue }, { translateX: xAnimValue }],
                                opacity: yAnimValue.interpolate({
                                    inputRange: [0, 50, 100],
                                    outputRange: [1, 0.5, 0],
                                }),
                            },
                        ]}
                    >
                        {number}
                    </Animated.Text>
                ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    bigEmoji: {
        fontSize: 150,
        position: 'absolute',
    },
    number: {
        fontSize: 40,
        fontFamily: "Digitalt",
        color: '#FFD700', // Gold color for the number
        position: 'absolute',
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2.5 },
        textShadowRadius: 4
    },
});
