import React, { useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import SegmentedControl from "../generalUI/SegmentedControl";
import { Freeze } from "./FreezeWhenBlurred";

interface ContentTabProps {
    tabs: Array<{
        name: string;
        component: React.ReactNode;
        notification?: number;
        onNavigateTo?: () => void;
    }>;
    initialIndex?: number;
    /** No longer used: content now sits directly below the control */
    contentSpacing?: number;
    containerStyle?: StyleProp<ViewStyle>;
}

/**
 * A segmented control with the active tab's content below it.
 *
 * Tabs stay mounted once visited, hidden and paused, so switching back is instant
 * instead of rebuilding big screens (like the upgrade catalogue) from scratch.
 */
export default function ContentTab(props: ContentTabProps) {
    const { tabs, initialIndex = 0, containerStyle } = props;
    const [activeTab, setActiveTab] = useState(initialIndex);
    const [visited, setVisited] = useState(() => new Set([initialIndex]));

    return (
        <View style={styles.container}>
            <SegmentedControl
                style={styles.control}
                activeIndex={activeTab}
                segments={tabs.map((tab, index) => ({
                    label: tab.name,
                    badge: tab.notification,
                    onPress: () => {
                        setActiveTab(index);
                        setVisited(current => current.has(index) ? current : new Set(current).add(index));
                        tab.onNavigateTo?.();
                    },
                }))}
            />
            {tabs.map((tab, index) => visited.has(index) && (
                <View key={index} style={[styles.child, containerStyle, index !== activeTab && styles.hidden]}>
                    <Freeze freeze={index !== activeTab}>{tab.component}</Freeze>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
    },
    control: {
        marginTop: 12,
        marginHorizontal: 20,
    },
    child: {
        flex: 1,
    },
    hidden: {
        display: "none",
    },
});
