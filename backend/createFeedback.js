// /python/createFeedback.js

import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Open DB
export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabase({ name: 'db.sqlite', location: 'default' });
    console.log('DB opened:', db);
    return db;
  } catch (error) {
    console.error('Error opening database', error);
    throw error;
  }
};

// Create feedbacks table (if not exists)
export const createFeedbacksTable = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      description TEXT
    );
  `;
  await db.executeSql(query);
};

// Insert feedback
export const addFeedback = async (db, name, phone, email, description) => {
  const query = `
    INSERT INTO feedbacks (name, phone, email, description)
    VALUES (?, ?, ?, ?);
  `;
  await db.executeSql(query, [name, phone, email, description]);
};

export const getAllFeedbacks = async (db) => {
    try {
      const results = await db.executeSql('SELECT * FROM feedbacks');
      const feedbacks = results[0].rows.raw();//get all feedbacks by rows
      return feedbacks;
    } catch (error) {
      console.error('Error fetching feedbacks', error);
    }
  };