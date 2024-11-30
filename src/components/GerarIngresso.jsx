import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";

function GerarIngresso() {
  const [nome, setNome] = useState("");
  const [evento, setEvento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [cpf, setCpf] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [cidades, setCidades] = useState([]);

  const [errors, setErrors] = useState({});

  // Carregar cidades de São Paulo ao montar o componente
  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP/municipios"
        );
        setCidades(response.data.map((cidade) => cidade.nome));
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    };
    fetchCidades();
  }, []);

  const validateFields = () => {
    const newErrors = {};

    if (!nome.trim()) newErrors.nome = "O nome é obrigatório.";
    if (!evento.trim()) newErrors.evento = "O evento é obrigatório.";
    if (!data) newErrors.data = "A data é obrigatória.";
    if (!hora) newErrors.hora = "A hora é obrigatória.";
    if (!local.trim()) newErrors.local = "O local é obrigatório.";
    if (!cpf.trim()) newErrors.cpf = "O CPF é obrigatório.";
    else if (cpf.length !== 11) newErrors.cpf = "O CPF deve ter 11 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;

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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom>
        Gerar Ingresso
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Nome"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={{ marginBottom: 2 }}
          error={!!errors.nome}
          helperText={errors.nome}
        />
        <TextField
          label="Evento"
          fullWidth
          value={evento}
          onChange={(e) => setEvento(e.target.value)}
          sx={{ marginBottom: 2 }}
          error={!!errors.evento}
          helperText={errors.evento}
        />
        <TextField
          label="Data"
          type="date"
          fullWidth
          value={data}
          onChange={(e) => setData(e.target.value)}
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          error={!!errors.data}
          helperText={errors.data}
        />
        <TextField
          label="Hora"
          type="time"
          fullWidth
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          error={!!errors.hora}
          helperText={errors.hora}
        />
        <TextField
          select
          label="Cidade"
          fullWidth
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          sx={{ marginBottom: 2 }}
          error={!!errors.local}
          helperText={errors.local}
        >
          {cidades.map((cidade) => (
            <MenuItem key={cidade} value={cidade}>
              {cidade}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="CPF"
          fullWidth
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          sx={{ marginBottom: 2 }}
          error={!!errors.cpf}
          helperText={errors.cpf}
        />
        <Button type="submit" variant="contained" fullWidth>
          Gerar QR Code
        </Button>
      </form>

      {qrCodeUrl && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">QR Code:</Typography>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{ marginTop: 10, width: "100%", maxWidth: 300 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default GerarIngresso;
