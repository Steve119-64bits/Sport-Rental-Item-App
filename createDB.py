import sqlite3

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

cursor = db.cursor()

cursor.execute('''INSERT INTO items(name, image, category) VALUES("Wooden Paddle", "wood_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Graphite Paddle", "graphite_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Composite Paddle", "composite_paddle", "Paddles")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Outdoor Pickleball", "outdoor_pickleball", "Pickleball")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Indoor Pickleball", "indoor_pickleball", "Pickleball")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Nylon Net", "nylon_net", "Net")''')
cursor.execute('''INSERT INTO items(name, image, category) VALUES("Polyethylene Net", "polyethylene_net", "Net")''')

db.commit()
db.close()
