import React from 'react';
import { ReactNode, useState } from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CircularButton from '../buttons/CircularButton';

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
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                    {!noExit && (
                        <View style={styles.closeButton}>
                            <CircularButton size={36} variant="close" onPress={onRequestClose} />
                        </View>
                    )}
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
        position: "absolute",
        right: 10,
        top: 10,
    },
});