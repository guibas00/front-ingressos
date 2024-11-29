import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QrReader } from "react-qr-reader";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/gerar">Gerar Ingresso</Link>
            </li>
            <li>
              <Link to="/validar">Validar Ingresso</Link>
            </li>
            <li>
              <Link to="/consultar">Consultar Ingressos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/gerar" element={<GerarIngresso />} />
          <Route path="/validar" element={<ValidarIngresso />} />
          <Route path="/consultar" element={<ConsultarIngressos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// --->>> COMPONENTE GerarIngresso <<<---
function GerarIngresso() {
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [cpf, setCpf] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://flask-ingressos-production.up.railway.app/gerar_ingresso",
        {
          nome,
          evento,
          data,
          hora,
          local,
          cpf,
        }
      );
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Gerar Ingresso</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="evento">Evento:</label>
          <input
            type="text"
            id="evento"
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="data">Data:</label>
          <input
            type="text"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hora">Hora:</label>
          <input
            type="text"
            id="hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="local">Local:</label>
          <input
            type="text"
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <button type="submit">Gerar QR Code</button>
      </form>
      {qrCodeUrl && (
        <div>
          <h3>QR Code:</h3>
          <img src={qrCodeUrl} alt="QR Code do Ingresso" />
        </div>
      )}
    </div>
  );
}
// --->>> FIM DO COMPONENTE GerarIngresso <<<---

// --->>> COMPONENTE ValidarIngresso <<<---
function ValidarIngresso() {
  const [status, setStatus] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      try {
        // Ajusta a lógica de extração do CPF e UUID conforme o formato do seu QR code
        const [cpf, uuid] = data.split(":");
        const response = await axios.post(
          "https://flask-ingressos-production.up.railway.app/validar_ingresso",
          {
            cpf,
            uuid,
          }
        );
        setStatus(response.data.status);
      } catch (error) {
        console.error(error);
        setStatus("inválido");
      } finally {
        setScannerOpen(false);
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
    setScannerOpen(false);
  };

  const handleOpenScanner = () => {
    setScannerOpen(true);
  };

  return (
    <div>
      <h2>Validar Ingresso</h2>
      {scannerOpen ? (
        <QrReader
          facingMode='environment'
          onResult={handleScan}
          onError={handleError}
          style={{ width: "100%" }}
        />
      ) : (
        <button onClick={handleOpenScanner}>Abrir Scanner</button>
      )}
      {status && <p>Status: {status}</p>}
    </div>
  );
}
// --->>> FIM DO COMPONENTE ValidarIngresso <<<---

// --->>> COMPONENTE ConsultarIngressos <<<---
function ConsultarIngressos() {
  const [cpf, setCpf] = useState("");
  const [ingressos, setIngressos] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://flask-ingressos-production.up.railway.app/ingressos/${cpf}`
      );
      setIngressos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Consultar Ingressos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <button type="submit">Consultar</button>
      </form>
      {ingressos.length > 0 && (
        <ul>
          {ingressos.map((ingresso, index) => (
            <li key={index}>
              <p>Nome: {ingresso.Nome}</p>
              <p>Evento: {ingresso.Evento}</p>
              <p>Data: {ingresso.Data}</p>
              <p>Hora: {ingresso.Hora}</p>
              <p>Local: {ingresso.Local}</p>
              {ingresso.image && (
                <img src={ingresso.image} alt="QR Code do Ingresso" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// --->>> FIM DO COMPONENTE ConsultarIngressos <<<---

export default App;