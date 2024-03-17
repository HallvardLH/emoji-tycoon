/**
 * The shadow on buttons, created with a view as native shadows are inconsitent and sub-optimal
 * Inserted before the contents of the component in which it is used
 */

import { View, StyleSheet, DimensionValue, StyleProp, ViewStyle } from "react-native";

interface ShadowProps{
    /** 
    * @property The height of the container on which the shadow is applied
    */
    height: number;
    /** 
    * @property The height of the shadow
    */
    shadowHeight?: number;
    /** 
    * @property The full width of the container + the width of the horizontal border on both sides
    * can be a percentage value
    */
    width: DimensionValue;
    backgroundColor?: string;
    borderRadius: number;
    style?: StyleProp<ViewStyle>;
}

export default function Shadow(props:ShadowProps) {
    const { height, shadowHeight = 4, width, borderRadius, backgroundColor = "rgba(0,0,0, 0.15)", style} = props;
    return(
        <View style={[
            styles.container,
            {
                height: height + shadowHeight,
                width: width,
                borderRadius: borderRadius,
                backgroundColor: backgroundColor,
            },
            style ? style : null
        ]} />
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
    },
})