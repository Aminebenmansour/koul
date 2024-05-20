import socket
import subprocess

HOST = '0.0.0.0'
PORT = 65433

def start_listening():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print("Serveur socket pour sockets.py en attente de connexions...")
        conn, addr = s.accept()
        with conn:
            print('Connecté par', addr)
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                command = data.decode()
                subprocess.run(['python', 'sockets.py'])

if __name__ == "__main__":
    start_listening()
