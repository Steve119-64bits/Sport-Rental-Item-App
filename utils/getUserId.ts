/**
 * Read the current signed‑in user ID from AsyncStorage.
 * Returns null if no ID is stored.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async (): Promise<number | null> => {
  const id = await AsyncStorage.getItem('USER_ID');
  return id ? Number(id) : null;
};