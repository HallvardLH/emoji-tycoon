import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
        console.error('Error storing data', e);
    }
};

const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        // error reading value
        console.error('Error retrieving data', e);
    }
};

const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch(e) {
        // error removing value
        console.error('Error removing data', e);
    }
};

export { storeData, getData, removeData };
