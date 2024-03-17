import React from 'react';
import { ReactNode } from 'react';
import { Modal as RNModal, View, StyleSheet } from 'react-native';
import CircularButton from '../buttons/CircularButton';

interface ModalProps {
    children?: ReactNode;
    modalVisible: boolean;
    onRequestClose?: () => void;
}

export default function Modal(props: ModalProps) {
    const { children, modalVisible, onRequestClose } = props;

    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onRequestClose}>
            <View style={styles.fullScreenView}>
                <View style={styles.modalView}>
                    {children}
                </View>
            </View>
            <View style={styles.closeButton}>
                <CircularButton size={36} variant="close" onPress={onRequestClose} />
            </View>
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
        width: '80%',
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 10,
    },
});
