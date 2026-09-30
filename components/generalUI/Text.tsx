import React, { ReactNode } from "react";
import { Text as RNText, StyleProp, TextStyle, StyleSheet, LayoutChangeEvent } from "react-native";
import { fonts, palette } from "../misc/theme";

interface TextProps {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;
    shadow?: boolean;
    shadowColor?: string;
    size?: number;
    color?: string;
    /** display = Lilita One (numbers, titles), body/bold/black/italic = Nunito */
    font?: keyof typeof fonts;
    defaultLineHeight?: boolean;
    onLayout?: (event: LayoutChangeEvent) => void;
    numberOfLines?: number;
}

// Fonts are loaded once in app/_layout.tsx before anything renders
export default function Text(props: TextProps) {
    const { children, style, shadow = false, shadowColor, size = 18, color = palette.paper, font = "display", defaultLineHeight, onLayout, ...rest } = props;

    return (
        <RNText
            onLayout={onLayout}
            style={[
                textStyles.text,
                { fontFamily: fonts[font] },
                shadow ? textStyles.shadow : null,
                shadowColor ? { textShadowColor: shadowColor } : null,
                { fontSize: size },
                { color: color },
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
        fontFamily: fonts.display,
        color: palette.paper,
        fontSize: 18,
    },

    shadow: {
        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    }
})

export { textStyles };
