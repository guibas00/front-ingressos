import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import jsQR from "jsqr";

function ValidarIngresso() {
  const [status, setStatus] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    if (scannerOpen) startCamera();
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [scannerOpen]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Validar Ingresso
      </Typography>
      {scannerOpen ? (
        <Box>
          <video ref={videoRef} autoPlay />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Box>
      ) : (
        <Button variant="contained" onClick={() => setScannerOpen(true)}>
          Abrir Scanner
        </Button>
      )}
      {status && <Typography>Status: {status}</Typography>}
    </Box>
  );
}

export default ValidarIngresso;
