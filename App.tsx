
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './scripts/redux/reduxStore';
import { gameLoop } from './scripts/game/gameLoop';
import { useEffect } from 'react';

import 'expo-router/entry';

export default function App() {
    // Starts the game loop
    useEffect(() => {
        const intervalId = setInterval(gameLoop, 100);
        return () => clearInterval(intervalId);
    }, []);

    return
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
