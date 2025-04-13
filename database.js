import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: 'user.db', location: 'default' });
};

export const createTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    email TEXT
  );`;
  await db.executeSql(query);
};

export const saveUser = async (db, firstName, lastName, phone, email) => {
  await db.executeSql('DELETE FROM user');
  await db.executeSql('INSERT INTO user (firstName, lastName, phone, email) VALUES (?, ?, ?, ?);', [firstName, lastName, phone, email]);
};

export const getUser = async (db) => {
  const results = await db.executeSql('SELECT * FROM user');
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};
