import React, { useState, useRef, ReactNode } from "react";
import { ScrollView, Pressable, Image, StyleSheet} from "react-native";
import { colors } from "../misc/Colors";

interface ScrollToTopViewProps {
    children?: ReactNode;
    scrollToTopThreshold?: number
}

export default function ScrollToTopView(props: ScrollToTopViewProps) {
    const { children, scrollToTopThreshold = 200 } = props;
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [scrollingBack, setScrollingBack] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        if (scrollPosition > scrollToTopThreshold && !scrollingBack) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
            setScrollingBack(false);
        }
    };

    const scrollToTop = () => {
        setShowScrollToTop(false);
        setScrollingBack(true);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };
    return(
        <>
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Adjust as needed for smoother or more responsive scrolling
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {children}
            </ScrollView>
            {showScrollToTop && (
                <Pressable
                    style={styles.scrollToTopButton}
                    onPress={scrollToTop}
                >
                    <Image style={styles.scrollToTopIcon} source={require("../../assets/icons/back.png")} />
                </Pressable>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    scrollToTopButton: {
        position: "absolute",
        alignSelf: "center",
        top: 0,
        backgroundColor: colors.purple.dark,
        borderWidth: 2,
        borderColor: colors.border,
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it's above other content
    },

    scrollToTopIcon: {
        width: 20,
        height: 20,
        transform: [{rotate: "90deg"}],
    }
});