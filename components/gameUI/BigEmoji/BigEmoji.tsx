import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Pressable, Text, Animated, View, Easing, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import { tapEmoji, pickNextEmoji } from '../../../scripts/game/bigEmoji';
import PulseAnimation from '../../animations/PulseAnimation';
import { formatNumber } from '../../../scripts/misc';
import * as Haptics from 'expo-haptics';
import { FlyingEmoji } from './FlyingEmoji';
import { FlyingNumber } from './FlyingNumber';
// import { useFonts } from "expo-font";

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

    // Necessary for using font
    // useFonts({
    //     "Digitalt": require("../../../assets/fonts/Digitalt.otf"),
    // });

    // State for the currently displayed static emoji
    const [staticEmoji, setStaticEmoji] = useState<string>(bigEmoji.emoji);

    // useEffect(() => {
    //     setStaticEmoji(bigEmoji.emoji);
    // }, [bigEmoji.emoji]);

    const [emojisPerTapDisplay, setEmojisPerTapDisplay] = useState<number>(emojisPerTap);

    // State to keep track of multiple animating emojis and numbers
    const animatingEmojis = useRef<AnimatedEmoji[]>([]);
    const animatingNumbers = useRef<AnimatedNumber[]>([]);

    const [, forceUpdate] = useState(0);

    useEffect(() => {
        setEmojisPerTapDisplay(emojisPerTap);
    }, [emojisPerTap]);

    const onEmojiTap = useCallback(() => {
        const animatingEmoji = staticEmoji;
        const nextPickedEmoji = pickNextEmoji();
        setStaticEmoji(nextPickedEmoji as string);

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

        // Add new animating emoji
        animatingEmojis.current.push({
            key: uniqueKey,
            emoji: animatingEmoji,
            yAnimValue: newYAnimValue,
            xAnimValue: newXAnimValue,
        });

        // Cap at 25
        if (animatingEmojis.current.length > 25) {
            animatingEmojis.current = animatingEmojis.current.slice(-25);
        }

        // Add new animating number
        animatingNumbers.current.push({
            key: `${uniqueKey}-num`,
            number: `+${formatNumber(emojisPerTapDisplay, 1)}`,
            yAnimValue: numberYAnimValue,
            xAnimValue: numberXAnimValue,
        });

        // Cap at 25
        if (animatingNumbers.current.length > 25) {
            animatingNumbers.current = animatingNumbers.current.slice(-25);
        }

        forceUpdate(x => x + 1);

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
            animatingEmojis.current = animatingEmojis.current.filter(item => item.key !== uniqueKey);
            animatingNumbers.current = animatingNumbers.current.filter(item => item.key !== `${uniqueKey}-num`);

            // Trigger a render again to remove from UI
            forceUpdate(x => x + 1);
        });

        tapEmoji();
    }, [staticEmoji, emojisPerTapDisplay, nextEmoji]);


    return (
        <Pressable
            onPress={() => {
                onEmojiTap();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }}
            style={styles.container}>
            <View style={styles.container}>
                {/* Static Emoji */}
                <PulseAnimation maxSize={1.06} duration={4000}>
                    <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                </PulseAnimation>

                {animatingEmojis.current.map(({ key, emoji, yAnimValue, xAnimValue }) => (
                    <FlyingEmoji
                        key={key}
                        emoji={emoji}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                    />
                ))}

                {animatingNumbers.current.map(({ key, number, yAnimValue, xAnimValue }) => (
                    <FlyingNumber
                        key={key}
                        number={number}
                        xAnim={xAnimValue}
                        yAnim={yAnimValue}
                    />
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
        fontSize: Platform.OS == 'android' ? 150 : 200,
        position: 'absolute',
    },
});
