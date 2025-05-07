import sqlite3
from werkzeug.security import generate_password_hash    # For password hashing

db = sqlite3.connect('items.sqlite')

db.execute('DROP TABLE IF EXISTS items')

db.execute('''
CREATE TABLE items(
    id integer PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL
)
''')

# Drop and recreate users table
db.execute('DROP TABLE IF EXISTS users')
db.execute('''
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    f_name TEXT NOT NULL,
    l_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone_no TEXT NOT NULL,
    branch_id INTEGER,
    FOREIGN KEY (branch_id) REFERENCES branch(id)
)
''')


cursor = db.cursor()

# Seed items
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Wooden Paddle", "wood_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Graphite Paddle", "graphite_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Composite Paddle", "composite_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Outdoor Pickleball", "outdoor_pickleball", "Pickleball")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Indoor Pickleball", "indoor_pickleball", "Pickleball")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Nylon Net", "nylon_net", "Net")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Polyethylene Net", "polyethylene_net", "Net")''')

# Seed users (with hashed passwords)
cursor.execute('''INSERT INTO users(f_name, l_name, email, password, phone_no, branch_id) 
                  VALUES("John", "Doe", "john@example.com", ?, "1234567890", NULL)''', 
               (generate_password_hash("john123"),))
cursor.execute('''INSERT INTO users(f_name, l_name, email, password, phone_no, branch_id) 
                  VALUES("Jane", "Smith", "jane@example.com", ?, "0987654321", NULL)''', 
               (generate_password_hash("jane123"),))
cursor.execute('''INSERT INTO users(f_name, l_name, email, password, phone_no, branch_id) 
                  VALUES("Mike", "Johnson", "mike@example.com", ?, "5555555555", NULL)''', 
               (generate_password_hash("mike123"),))

db.commit()
db.close()
