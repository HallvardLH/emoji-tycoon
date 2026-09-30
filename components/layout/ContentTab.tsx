import React, { useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import SegmentedControl from "../generalUI/SegmentedControl";

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

/** A segmented control with the active tab's content below it */
export default function ContentTab(props: ContentTabProps) {
    const { tabs, initialIndex = 0, containerStyle } = props;
    const [activeTab, setActiveTab] = useState(initialIndex);

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
                        tab.onNavigateTo?.();
                    },
                }))}
            />
            <View style={[styles.child, containerStyle]}>
                {tabs[activeTab].component}
            </View>
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
});
