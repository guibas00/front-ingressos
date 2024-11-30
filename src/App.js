import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import jsQR from "jsqr";
import "./App.css"; // Importa o arquivo CSS

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
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
    <div className="form-container">
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
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream;
    let interval;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 640 }, // Largura ideal
            height: { ideal: 480 }, // Altura ideal
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    const scanQRCode = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (
        canvas &&
        video &&
        video.readyState === video.HAVE_ENOUGH_DATA &&
        video.videoWidth > 0
      ) {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          try {
            // Analisa o JSON do QR code
            const qrCodeData = JSON.parse(code.data);

            // Extrai o CPF e o UUID do objeto JSON
            const cpf = qrCodeData.cpf;
            const uuid = qrCodeData.uuid;

            axios
              .post(
                "https://flask-ingressos-production.up.railway.app/validar_ingresso",
                {
                  cpf,
                  uuid,
                }
              )
              .then((response) => {
                setStatus(response.data.status);
              })
              .catch((error) => {
                console.error(error);
                setStatus("inválido");
              })
              .finally(() => {
                stopCamera();
                setScannerOpen(false);
              });
          } catch (error) {
            console.error("Erro ao analisar o JSON do QR code:", error);
            setStatus("QR code inválido");
          }
        }
      }
    };

    if (scannerOpen) {
      startCamera();
      interval = setInterval(scanQRCode, 500); // Escaneia a cada 500ms
    }

    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, [scannerOpen]);

  const handleOpenScanner = () => {
    setScannerOpen(true);
  };

  return (
    <div className="scanner-container">
      <h2>Validar Ingresso</h2>
      {scannerOpen ? (
        <div>
          <video ref={videoRef} autoPlay muted />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
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
  const [showModal, setShowModal] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState("");

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

  const handleOpenModal = (qrCodeUrl) => {
    setSelectedQrCode(qrCodeUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendWhatsapp = () => {
    // Encode the URL to handle special characters
    const encodedQrCodeUrl = encodeURIComponent(selectedQrCode);
    const whatsappLink = `https://wa.me/?text=Olá!%20Segue%20o%20link%20para%20o%20seu%20ingresso:%20${encodedQrCodeUrl}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="form-container">
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

      <div className="ingressos-container">
        {ingressos.length > 0 &&
          ingressos.map((ingresso, index) => (
            <div className="ingresso-card" key={index}>
              <div className="ingresso-info">
                <p>Nome: {ingresso.Nome}</p>
                <p>Evento: {ingresso.Evento}</p>
                <p>Data: {ingresso.Data}</p>
                <p>Hora: {ingresso.Hora}</p>
                <p>Local: {ingresso.Local}</p>
              </div>
              <button onClick={() => handleOpenModal(ingresso.image)}>
                Ver QR Code
              </button>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={selectedQrCode} alt="QR Code do Ingresso" />

            <button onClick={handleSendWhatsapp}>Enviar por WhatsApp</button>
          </div>
        </div>
      )}
    </div>
  );
}
// --->>> FIM DO COMPONENTE ConsultarIngressos <<<---

export default App;
