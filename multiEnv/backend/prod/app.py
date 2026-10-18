from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

tickets = [
    {"id": 1, "title": "Prod Critical: Memory spike on API gateway router", "status": "Open"},
    {"id": 2, "title": "Prod Issue: Renew domain TLS certificates", "status": "Resolved"}
]

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    return jsonify({"environment": "Production", "tickets": tickets})

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    new_ticket = {
        "id": len(tickets) + 1,
        "title": f"Prod Critical: {data.get('title')}",
        "status": "Open"
    }
    tickets.append(new_ticket)
    return jsonify(new_ticket), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002, debug=False)

