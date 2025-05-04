import SQLite from 'react-native-sqlite-storage';

const database = SQLite.openDatabase(
  {
    name: 'items.sqlite',
    location: 'default',
    createFromLocation: '~items.sqlite', 
  },
  () => { console.log('Database opened'); },
  error => { console.error('Database open error: ', error); }
);


// Fetch items by category
export const getItemsByCategory = (category: string): Promise<Array<{ id: number, name: string, image: string, category: string }>> => {
  
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT id, name, image, category FROM items WHERE category = ?', // ✅ SELECT category too
        [category],
        (_, results) => {
          const rows = results.rows;
          const items: Array<{ id: number, name: string, image: string, category: string }> = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          }
          resolve(items);
        },
        (_, error) => {
          console.error('Query error: ', error);
          reject(error);
          return false;
        }
      );
    });
  });
};
