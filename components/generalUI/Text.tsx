import React, { ReactNode } from "react";
import { Text as RNText, StyleProp, TextStyle, StyleSheet, LayoutChangeEvent } from "react-native";
import { componentColors } from "../misc/Colors";
import { useFonts } from "expo-font";
import { RussoOne_400Regular } from "@expo-google-fonts/russo-one/400Regular";
import { Baloo2_800ExtraBold } from "@expo-google-fonts/baloo-2/800ExtraBold";
import { BalooDa2_800ExtraBold } from "@expo-google-fonts/baloo-da-2/800ExtraBold";
import { Commissioner_900Black } from "@expo-google-fonts/commissioner/900Black";
import { Kanit_700Bold } from "@expo-google-fonts/kanit/700Bold";
import { Lalezar_400Regular } from "@expo-google-fonts/lalezar/400Regular";
import { getLanguage } from "../../i18n";
import { languageTextStyles } from "../../i18n/fonts";

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
    /** Shrinks the text to fit its container, together with numberOfLines */
    adjustsFontSizeToFit?: boolean;
    minimumFontScale?: number;
}

export default function Text(props: TextProps) {
    const { children, style, shadow = true, shadowColor, size = 18, color = "white", defaultLineHeight = false, onLayout, ...rest } = props;

    const [fontsLoaded] = useFonts({
        "Digitalt": require("../../assets/fonts/Digitalt.otf"),
        // Fonts for languages Digitalt cannot display, see i18n/fonts.ts
        "RussoOne": RussoOne_400Regular,
        "Baloo2": Baloo2_800ExtraBold,
        "BalooDa2": BalooDa2_800ExtraBold,
        "Commissioner": Commissioner_900Black,
        "Kanit": Kanit_700Bold,
        "Lalezar": Lalezar_400Regular,
    });

    // The app remounts when the language changes, so this does not need to subscribe to changes
    const languageStyle = languageTextStyles[getLanguage()];

    if (!fontsLoaded) {
        return null;
    }

    return (
        <RNText
            // textBreakStrategy="highQuality"
            onLayout={onLayout}
            style={[
                textStyles.text,
                languageStyle ? {
                    // undefined falls back to the system font
                    fontFamily: languageStyle.fontFamily ?? undefined,
                    fontWeight: languageStyle.fontFamily ? undefined : "bold",
                    writingDirection: languageStyle.rtl ? "rtl" : undefined,
                } : null,
                shadow ? textStyles.shadow : null,
                shadowColor ? { textShadowColor: shadowColor } : null,
                { fontSize: size },
                { color: color },
                defaultLineHeight ? null : { lineHeight: 22 },
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
 * Scripts with tall letters or marks above and below get cut off by the line heights
 * the game uses for Digitalt, including ones set by components, so make room for them
 */
function getTallLineHeight(style: StyleProp<TextStyle>, size: number) {
    const { lineHeight = 22, fontSize = size } = StyleSheet.flatten(style) ?? {};
    return Math.max(lineHeight, Math.round(fontSize * 1.6));
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