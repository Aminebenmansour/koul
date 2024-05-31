import React, { useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5009");

const Test = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleChange = (event) => {
    setIpAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post("http://127.0.0.1:5009/post_ip", {
        ipAddress: ipAddress
      });
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'adresse IP au backend :", error);
    }
  };

  const handleConfirm = async (confirmValue) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5009/confirm?value=${confirmValue}`);
      setConfirmation(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la confirmation :", error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5009/kill_process_on_port", {
        port: 5000
      });
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'arrêt du processus :", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          Adresse IP:
          <input 
            type="text" 
            value={ipAddress} 
            onChange={handleChange} 
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginRight: '10px'
            }}
          />
        </label>
        <button 
          type="submit" 
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Envoyer
        </button>
      </form>
     
      {confirmation && <p>Confirmation : {confirmation}</p>}
      <button 
        onClick={handleStop} 
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Stop
      </button>
    </div>
  );
};

export default Test;
