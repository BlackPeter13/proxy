
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import threading
import socket
import json

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

logs = []
stats = {"shares_submitted": 0, "hash_rate": 0}

@socketio.on("connect")
def handle_connect():
    emit("initial_logs", logs)

def add_log(message):
    logs.append(message)
    if len(logs) > 100:
        logs.pop(0)
    socketio.emit("log_update", {"message": message})

def update_stats(shares, hash_rate):
    stats["shares_submitted"] += shares
    stats["hash_rate"] = hash_rate
    socketio.emit("stats_update", stats)

def handle_client(client_socket):
    try:
        add_log(f"New miner connected: {client_socket.getpeername()}")
        update_stats(1, 50.5)
    except Exception as e:
        add_log(f"Error: {e}")

@app.route("/stats", methods=["GET"])
def get_stats():
    return jsonify(stats)

def start_proxy():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 8080))
    server.listen(5)
    print("Proxy running on 0.0.0.0:8080")

    while True:
        client_socket, addr = server.accept()
        threading.Thread(target=handle_client, args=(client_socket,)).start()

if __name__ == "__main__":
    threading.Thread(target=start_proxy).start()
    socketio.run(app, host="0.0.0.0", port=5000)
