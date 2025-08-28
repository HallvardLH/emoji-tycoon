import React, { useState } from "react";
import { Pressable, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import Text from "../generalUI/Text";
import { componentColors } from "../misc/Colors";
import Shadow from "../misc/Shadow";
import { percentageOf as p } from "../../scripts/utils";

interface BaseButtonProps {
    leftColor?: string;
    rightColor?: string;
    highlightColor?: string;
    borderRadius?: number;
    onPress?: () => void;
    label?: string;
    widthPercentage?: number;
    heightPercentage?: number;
    borderWidth?: number;
    buttonWidth?: number;
    fontSize?: number;
    shadowHeight?: number;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    down?: boolean; // external override
}

export default function BaseButton(props: BaseButtonProps) {
    const {
        leftColor = "#D6AFFE",
        rightColor = "#C286FF",
        highlightColor = "#A75CF4",
        borderRadius = 22,
        onPress,
        label,
        widthPercentage = 100,
        heightPercentage = 40,
        borderWidth = 2.5,
        fontSize = 18,
        shadowHeight = 10,
        style = null,
        disabled,
        down: externalDown,
    } = props;

    const [pressed, setPressed] = useState(false);

    // Effective down state = either controlled or internal pressed
    const down = externalDown ? true : pressed;


    const buttonWidth = p(widthPercentage, 100);
    const buttonContainerWidth = buttonWidth + borderWidth * 2;
    const buttonHeight = p(heightPercentage, 100);

    const leftPolygonPoints = `
    0,${p(heightPercentage, 100)}
    ${p(widthPercentage, 70)},${p(heightPercentage, 100)}
    ${p(widthPercentage, 35)},0
    0,0`;

    const rightPolygonPoints = `
    ${p(widthPercentage, 100)},0
    ${p(widthPercentage, 30)},0
    ${p(widthPercentage, 65)},${p(heightPercentage, 100)}
    ${p(widthPercentage, 100)},${p(heightPercentage, 100)}`;

    return (
        <Pressable
            style={style}
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={disabled}
        >
            <Shadow
                style={{
                    borderTopRightRadius: down ? 25 : borderRadius,
                    borderTopLeftRadius: down ? 25 : borderRadius,
                }}
                height={buttonHeight + shadowHeight}
                width={buttonContainerWidth}
                borderRadius={borderRadius}
            />
            <View
                style={[
                    styles.container,
                    {
                        borderWidth: borderWidth,
                        borderTopWidth: down ? 6 : 2.5,
                        width: buttonContainerWidth,
                        height: buttonHeight + 10,
                        borderRadius: borderRadius,
                    },
                ]}
            >
                {!down && (
                    <View
                        style={[
                            styles.background,
                            {
                                width: buttonWidth,
                                height: buttonHeight + 10,
                                backgroundColor: highlightColor,
                            },
                        ]}
                    />
                )}
                <View
                    style={[
                        styles.innerButtonContainer,
                        {
                            width: buttonWidth,
                            height: buttonHeight,
                            borderTopRightRadius: down ? 6 : 0,
                            borderTopLeftRadius: down ? 6 : 0,
                            borderBottomLeftRadius: down
                                ? 0
                                : borderRadius - p(10, borderRadius),
                            borderBottomRightRadius: down
                                ? 0
                                : borderRadius - p(10, borderRadius),
                        },
                    ]}
                >
                    <Svg
                        height="100%"
                        width="100%"
                        viewBox={`0 0 ${widthPercentage} ${heightPercentage}`}
                    >
                        <Polygon points={leftPolygonPoints} fill={leftColor} />
                        <Polygon points={rightPolygonPoints} fill={rightColor} />
                    </Svg>
                    <Text shadow style={[styles.buttonText, { fontSize: fontSize }]}>
                        {label}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: componentColors.button.border,
        overflow: "hidden",
    },
    background: {
        position: "absolute",
    },
    innerButtonContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    buttonText: {
        position: "absolute",
        color: componentColors.button.text,
        fontSize: 24,
    },
});
