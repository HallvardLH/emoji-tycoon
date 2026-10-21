import React, { ReactNode } from "react";
import { Text as RNText, StyleProp, TextStyle, StyleSheet, LayoutChangeEvent } from "react-native";
import { fonts, palette } from "../misc/theme";
import { getLanguage } from "../../i18n";
import { languageTextStyles } from "../../i18n/fonts";

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
    /** Shrinks the text to fit its container, together with numberOfLines */
    adjustsFontSizeToFit?: boolean;
    minimumFontScale?: number;
}

/**
 * The font for a role in the current language, see i18n/fonts.ts.
 * undefined falls back to the system font. For text not drawn with this component
 */
export function fontFamilyFor(font: keyof typeof fonts) {
    const languageStyle = languageTextStyles[getLanguage()];
    const replacement = font === "display" ? languageStyle?.display : languageStyle?.body;
    if (replacement === undefined) return fonts[font];
    return replacement ?? undefined;
}

// Fonts are loaded once in app/_layout.tsx before anything renders
export default function Text(props: TextProps) {
    const { children, style, shadow = false, shadowColor, size = 18, color = palette.paper, font = "display", defaultLineHeight, onLayout, ...rest } = props;

    // The app remounts when the language changes, so this does not need to subscribe to changes
    const languageStyle = languageTextStyles[getLanguage()];
    const fontFamily = fontFamilyFor(font);

    return (
        <RNText
            onLayout={onLayout}
            style={[
                textStyles.text,
                { fontFamily },
                // The system font, used for e.g. Chinese, needs a weight to match the game's chunky fonts
                fontFamily === undefined ? { fontWeight: "bold" } : null,
                languageStyle?.rtl ? { writingDirection: "rtl" } : null,
                shadow ? textStyles.shadow : null,
                shadowColor ? { textShadowColor: shadowColor } : null,
                { fontSize: size },
                { color: color },
                style,
                languageStyle?.tall ? { lineHeight: getTallLineHeight(style, size) } : null,
                languageStyle?.noLetterSpacing ? { letterSpacing: 0 } : null,
            ]}
            {...rest}
        >
            {children}
        </RNText>
    );
}

/**
 * Scripts with tall letters or marks above and below get cut off by tight line heights,
 * including ones set by components, so make room for them
 */
function getTallLineHeight(style: StyleProp<TextStyle>, size: number) {
    const { lineHeight = 0, fontSize = size } = StyleSheet.flatten(style) ?? {};
    return Math.max(lineHeight, Math.round(fontSize * 1.6));
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
