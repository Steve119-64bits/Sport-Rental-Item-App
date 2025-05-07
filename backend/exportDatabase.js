import RNFS from 'react-native-fs';

export const getDBConnection = async () => {
  const dbPath = `${RNFS.DocumentDirectoryPath}/db.sqlite`;  // Uses a path in the app's document directory
  return SQLite.openDatabase({ name: dbPath, location: 'default' });
};
