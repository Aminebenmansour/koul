import socket
import subprocess

HOST = '0.0.0.0'  # L'adresse IP du serveur
PORT = 65432      # Le port sur lequel le serveur va écouter
def send_message_to_frontend(message):
    send(message, broadcast=True)
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print("Serveur socket en attente de connexions...")
    conn, addr = s.accept()
    with conn:
        print('Connecté par', addr)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            # Exécutez le script Python avec les données reçues (adresse IP)
            ip_address = data.decode()
            print("Adresse IP reçue :", ip_address)
            
            # Exécutez le script semiautorecon.py avec l'adresse IP comme argument
            try:
                subprocess.run(['python', 'semiautorecon.py', ip_address], check=True)
                print("Script executed successfully.")
            except subprocess.CalledProcessError as e:
                print("Error executing script:", e)
