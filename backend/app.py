from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash   # For password hashing

app = Flask(__name__)
CORS(app)  # Allows requests from React Native

DB_PATH = 'items.sqlite'

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(query, args)
    # for data-changing queries, commit the changes
    if query.strip().upper().startswith("INSERT") or \
       query.strip().upper().startswith("UPDATE") or \
       query.strip().upper().startswith("DELETE"):
        conn.commit()  # commit if data-changing query
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/items', methods=['GET'])
def get_items_by_category():
    category = request.args.get('category')
    if not category:
        return jsonify({'error': 'Missing category'}), 400

    rows = query_db("SELECT id, name, image, category FROM items WHERE category = ?", [category])
    items = [{'id': r[0], 'name': r[1], 'image': r[2], 'category': r[3]} for r in rows]
    return jsonify(items)

@app.route('/book', methods=['POST'])
def book_item():
    data = request.json
    print("✅ Received booking:", data)
    return jsonify({"status": "success", "message": "Please continue to the payment step to finalize your booking."})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    f_name = data.get('f_name')
    l_name = data.get('l_name')
    email = data.get('email').strip().lower()
    password = data.get('password')
    phone_no = data.get('phone_no')
    branch_id = data.get('branch_id')  # optional

    if not all([f_name, l_name, email, password, phone_no]):
        return jsonify({'error': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(password)

    try:
        query_db(
            "INSERT INTO users (f_name, l_name, email, password, phone_no, branch_id) VALUES (?, ?, ?, ?, ?, ?)",
            (f_name, l_name, email, hashed_password, phone_no, branch_id)
        )
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    row = query_db("SELECT id, f_name, l_name, password FROM users WHERE email = ?", [email], one=True)
    
    print("User found:", row)  # <<< Debug print here

    if row:
        user_id, f_name, l_name, hashed_password = row
        if check_password_hash(hashed_password, password):
            return jsonify({'message': 'Login successful', 'user': {
                'id': user_id,
                'f_name': f_name,
                'l_name': l_name,
                'email': email
            }})
        else:
            return jsonify({'error': 'Invalid password'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    row = query_db("SELECT f_name, l_name, email, phone_no FROM users WHERE id = ?", [user_id], one=True)
    if row:
        return jsonify({
            'firstName': row[0],
            'lastName': row[1],
            'email': row[2],
            'phone': row[3]
        })
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    query_db("""
        UPDATE users
        SET f_name = ?, l_name = ?, email = ?, phone_no = ?
        WHERE id = ?
    """, [data.get('firstName'), data.get('lastName'), data.get('email'), data.get('phone'), user_id])
    return jsonify({'message': 'User updated successfully'})

@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    # Check if the user exists before retrieving the cart
    row = query_db("SELECT id FROM users WHERE id = ?", [user_id], one=True)
    if not row:
        print(f"User with ID {user_id} not found.")  # Debugging output
        return jsonify({'error': 'User not found'}), 404  # Return if user does not exist

    rows = query_db("SELECT id, name, price, quantity, selected, image FROM cart_items WHERE user_id = ?", [user_id])
    items = [
        {
            'id': r[0],
            'name': r[1],
            'price': r[2],
            'quantity': r[3],
            'selected': bool(r[4]),
            'image': r[5]
        } for r in rows
    ]
    return jsonify(items)


@app.route('/api/cart/<int:user_id>', methods=['PUT'])
def update_cart(user_id):
    # Check if user exists before updating cart
    row = query_db("SELECT id FROM users WHERE id = ?", [user_id], one=True)
    if not row:
        return jsonify({'error': 'User not found'}), 404

    items = request.get_json()

    # Clear existing cart for this user and insert new items
    query_db("DELETE FROM cart_items WHERE user_id = ?", [user_id])

    for item in items:
        query_db('''
            INSERT INTO cart_items (user_id, name, price, quantity, selected, image)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            user_id,
            item.get('name'),
            item.get('price'),
            item.get('quantity'),
            int(item.get('selected', False)),
            item.get('image')
        ])

    return jsonify({'message': 'Cart updated successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
