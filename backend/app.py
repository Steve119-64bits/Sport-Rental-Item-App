from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows requests from React Native

DB_PATH = 'items.sqlite'

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(query, args)
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
    return jsonify({"status": "success", "message": "Booking received successfully."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
