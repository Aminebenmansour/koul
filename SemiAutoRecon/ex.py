from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import socket
import subprocess
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

HOST = '0.0.0.0'  # L'adresse IP du serveur
PORT = 65432      # Le port sur lequel le serveur va écouter

@socketio.on('message')
def handle_message(message):
    print('ssss')
    print('Received message: ' + message)
    # Renvoyez le message au frontend
    emit('message', message)

def execute_script_with_ip(ip_address):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(ip_address.encode())
    # Envoyer un message à l'interface utilisateur via une connexion WebSocket
    socketio.emit('message', "Address IP received: " + ip_address)

@app.route('/kill_process_on_port', methods=['POST'])
def kill_process_on_port():
    port = request.json.get('port')
    if not port:
        return jsonify({"error": "Port not provided"}), 400

    try:
        result = subprocess.run(['lsof', '-i', f':{port}'], capture_output=True, text=True, check=True)
        for line in result.stdout.splitlines()[1:]:  # Skip the first line (header)
            parts = line.split()
            pid = int(parts[1])  # The PID is the second column
            print(f"Killing process with PID {pid} using port {port}")
            os.kill(pid, 9)  # Send SIGKILL to the process
        
        # Après avoir tué les processus, exécuter sockets.py
        subprocess.Popen(['python', 'sockets.py'])

        return jsonify({"message": f"Processes using port {port} have been killed"}), 200
    except subprocess.CalledProcessError:
        return jsonify({"error": "No process found using the specified port"}), 404

@app.route('/post_ip', methods=['POST'])
def post_ip():
    data = request.json
    ip_address = data.get('ipAddress')
    if ip_address:
        execute_script_with_ip(ip_address)
        return 'Adresse IP envoyée avec succès au serveur socket distant', 200
    return 'Adresse IP non fournie', 400

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5009)
