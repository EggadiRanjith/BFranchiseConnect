import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

export const saveTokenToStorage = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const removeTokenFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
