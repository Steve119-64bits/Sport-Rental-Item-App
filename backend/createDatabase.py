import sqlite3
db = sqlite3.connect('db.sqlite')

db.execute('''CREATE TABLE branches(
    id integer PRIMARY KEY AUTOINCREMENT,
    branch_name text NOT NULL,
    location text NOT NULL
)''')

db.execute('''
CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    description TEXT
)
''')    

cursor = db.cursor()

cursor.execute('''INSERT INTO branches(branch_name,location) VALUES("MINES 2","PickMe Sports Centre @ MINES 2, Pusat Perdagangan Mines, Jalan Mines 2, Mines Wellness City, Seri Kembangan, Selangor, Malaysia")''')
cursor.execute('''INSERT INTO branches(branch_name,location) VALUES("SJK(C) Connaught 2","PickMe Sports SJK(C) Connaught 2, Jalan Damai Perdana 1/8D, Bandar Damai Perdana, 56000 Cheras, Selangor, Malaysia")''')
cursor.execute('''INSERT INTO branches(branch_name,location) VALUES("PickMe store","Akademi Badminton Malaysia (ABM), Jalan 1/70 D Bukit Kiara, 60000 Kuala Lumpur, Malaysia.")''')

db.commit()
db.close()  