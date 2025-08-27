import React from 'react';
import { ReactNode } from 'react';
import { View, Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, StyleProp, TextStyle, StatusBar, Platform } from 'react-native';
import GradientBackground from './GradientBackground';

interface ScreenViewProps {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;
    scrollView?: boolean;
}

export const HEADER_HEIGHT = 64 + (StatusBar.currentHeight ? StatusBar.currentHeight : 0);
export const TAB_BAR_HEIGHT = Platform.OS == "android" ? 100 : 120;

export const SCREEN_HEIGHT = Dimensions.get("screen").height - (HEADER_HEIGHT + TAB_BAR_HEIGHT + 20);

export default function ScreenView(props: ScreenViewProps) {
    const { children, style, scrollView = true } = props;

    return (
        <View style={styles.container}>
            <GradientBackground />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    {scrollView ? (
                        <ScrollView contentContainerStyle={[styles.screenContainer, style]}>
                            {children}
                        </ScrollView>
                    ) : (
                        <View style={[styles.screenContainer, style]}>
                            {children}
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7054FE"
    },
    screenContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        // maxHeight: SCREEN_HEIGHT,
        // minHeight: SCREEN_HEIGHT,
        flex: 1,
        // marginTop: HEADER_HEIGHT,
        // marginBottom: TAB_BAR_HEIGHT,
        overflow: "hidden",
    },
});
