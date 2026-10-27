import React from 'react';
import { ReactNode, useState } from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CloseButton from './CloseButton';

interface ModalProps {
    children?: ReactNode;
    modalVisible: boolean;
    onRequestClose?: () => void;
    noExit?: boolean;
    onShow?: () => void;
}

export default function Modal(props: ModalProps) {
    const { children, modalVisible, onRequestClose, noExit, onShow } = props;

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onShow={onShow}
            onRequestClose={onRequestClose}
        >
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