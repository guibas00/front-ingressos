import React, { useState } from "react";
import axios from "axios";
import "../styles/IngressosCards.css";

const IngressoApp = () => {
  const [cpf, setCpf] = useState("");
  const [ingressos, setIngressos] = useState([]);

  const handleSearch = async () => {
    if (!cpf) {
      alert("Por favor, insira um CPF.");
      return;
    }

    try {
      const response = await axios.get(
        `https://flask-ingressos-production.up.railway.app/ingressos/${cpf}`
      );
      setIngressos(response.data);
    } catch (error) {
      console.error("Erro ao buscar ingressos:", error);
      alert("Erro ao buscar ingressos. Tente novamente.");
    }
  };

  return (
    <div className="app-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="cpf-input"
        />
        <button onClick={handleSearch} className="search-button">
          Consultar
        </button>
      </div>
      <div className="cards-container">
        {ingressos.map((ingresso, index) => (
          <div key={index} className="card">
            <img
              src={ingresso.image}
              alt={`Ingresso para ${ingresso.Evento}`}
              className="card-image"
            />
            <div className="card-content">
              <h3>{ingresso.Nome}</h3>
              <p><strong>Evento:</strong> {ingresso.Evento}</p>
              <p><strong>Data:</strong> {ingresso.Data}</p>
              <p><strong>Hora:</strong> {ingresso.Hora}</p>
              <p><strong>Local:</strong> {ingresso.Local}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngressoApp;
