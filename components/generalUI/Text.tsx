import React, { ReactNode } from "react";
import { Text as RNText, StyleProp, TextStyle, StyleSheet, LayoutChangeEvent } from "react-native";
import { componentColors } from "../misc/Colors";
import { useFonts } from "expo-font";

interface TextProps {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;
    shadow?: boolean;
    shadowColor?: string;
    size?: number;
    color?: string;
    defaultLineHeight?: boolean;
    onLayout?: (event: LayoutChangeEvent) => void;
    numberOfLines?: number;
}

export default function Text(props: TextProps) {
    const { children, style, shadow = true, shadowColor, size = 18, color = "white", defaultLineHeight = false, onLayout, ...rest } = props;

    const [fontsLoaded] = useFonts({
        "Digitalt": require("../../assets/fonts/Digitalt.otf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <RNText
            // textBreakStrategy="highQuality"
            onLayout={onLayout}
            style={[
                textStyles.text,
                shadow ? textStyles.shadow : null,
                shadowColor ? { textShadowColor: shadowColor } : null,
                { fontSize: size },
                { color: color },
                defaultLineHeight ? null : { lineHeight: 22 },
                style,
            ]}
            {...rest}
        >
            {children}
        </RNText>
    );
}

const textStyles = StyleSheet.create({
    text: {
        fontFamily: "Digitalt",
        letterSpacing: 1,
        color: componentColors.text.default,
        fontSize: 18,
    },

    shadow: {
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2.5 },
        textShadowRadius: 4
    }
})

export { textStyles };