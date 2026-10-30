import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ReactNode } from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import CloseButton from './CloseButton';

/**
 * Runs callbacks once a React Native modal has fully closed, for opening a screen from it.
 *
 * On iOS the modal is a presented view controller until its dismissal finishes. A screen
 * presented meanwhile (the gem store) sat on top of it and went down with it, after which
 * the navigator presented the screen again, over and over. Pass `onDismiss` to the RNModal
 */
export function useAfterDismiss(visible: boolean, onDismissed?: () => void) {
    const pending = useRef<(() => void)[]>([]);
    const latestOnDismissed = useRef(onDismissed);
    latestOnDismissed.current = onDismissed;
    const flush = () => {
        pending.current.splice(0).forEach(callback => callback());
        latestOnDismissed.current?.();
    };

    // Elsewhere the modal is gone as soon as it's hidden
    const wasVisible = useRef(visible);
    useEffect(() => {
        if (Platform.OS !== "ios" && wasVisible.current && !visible) flush();
        wasVisible.current = visible;
    }, [visible]);

    return {
        afterDismiss: (callback: () => void) => { pending.current.push(callback); },
        onDismiss: Platform.OS === "ios" ? flush : undefined,
    };
}

// Closes the modal around a component, then runs the callback once it's gone
const CloseModalContext = createContext<((then: () => void) => void) | null>(null);

/** Inside a Modal: closes it, then runs the callback once it's fully gone. Null outside one */
export function useCloseModalThen() {
    return useContext(CloseModalContext);
}

interface ModalProps {
    children?: ReactNode;
    modalVisible: boolean;
    onRequestClose?: () => void;
    noExit?: boolean;
    onShow?: () => void;
    /** Once the modal has fully closed */
    onDismiss?: () => void;
}

export default function Modal(props: ModalProps) {
    const { children, modalVisible, onRequestClose, noExit, onShow, onDismiss } = props;
    const dismissal = useAfterDismiss(modalVisible, onDismiss);

    const closeThen = (then: () => void) => {
        dismissal.afterDismiss(then);
        onRequestClose?.();
    };

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onShow={onShow}
            onDismiss={dismissal.onDismiss}
            onRequestClose={onRequestClose}
        >
            <CloseModalContext.Provider value={closeThen}>
                <TouchableWithoutFeedback onPress={onRequestClose}>
                    <View style={styles.fullScreenView}>
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalView}>
                                {/* Above the card's right corner. Inside the modal's bounds, as
                                    Android ignores taps on anything hanging outside its parent */}
                                {!noExit && (
                                    <CloseButton onPress={onRequestClose} style={styles.closeButton} />
                                )}
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </CloseModalContext.Provider>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    fullScreenView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        borderRadius: 20,
        alignItems: "center",
        width: '88%',
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 10,
    },
});
