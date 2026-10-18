from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so the React app running in the browser can talk to this port
CORS(app, resources={r"/*": {"origins": "*"}})

tickets = [
    {"id": 1, "title": "Dev Issue: Fix localized DB connection strings", "status": "Open"},
    {"id": 2, "title": "Dev Issue: Seed development stub data", "status": "In Progress"}
]

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    return jsonify({"environment": "Development", "tickets": tickets})

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    new_ticket = {
        "id": len(tickets) + 1,
        "title": f"Dev: {data.get('title')}",
        "status": "Open"
    }
    tickets.append(new_ticket)
    return jsonify(new_ticket), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)