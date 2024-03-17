import * as SecureStore from 'expo-secure-store';

const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
    } catch (e) {
        console.error('Error storing data', e);
        throw e; // Re-throw the error for further handling if required
    }
};

const getData = async (key) => {
    try {
        const jsonValue = await SecureStore.getItemAsync(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.error('Error retrieving data', e);
        throw e; // Re-throw the error for further handling if required
    }
};

const removeData = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch(e) {
        console.error('Error removing data', e);
        throw e; // Re-throw the error for further handling if required
    }
};

export { storeData, getData, removeData };