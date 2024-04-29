
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigationStack from './screens/AppNavigationStack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './scripts/redux/reduxStore';
import { gameLoop } from './scripts/game/gameLoop';
import { useEffect } from 'react';

export default function App() {
    // Starts the game loop
    useEffect(() => {
        const intervalId = setInterval(gameLoop, 100);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <View style={styles.container}>
                    <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppNavigationStack />
                    </NavigationContainer>
                </View>
            </PersistGate>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
