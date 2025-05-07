import sqlite3
db = sqlite3.connect('items.sqlite')
db.execute('''
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    price REAL,
    quantity INTEGER,
    selected INTEGER,
    image TEXT
)
''')
db.commit()
db.close()
