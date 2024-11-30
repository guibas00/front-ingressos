import axios from "axios";

const api = axios.create({
  baseURL: "https://flask-ingressos-production.up.railway.app/",
});

export const gerarIngresso = (dados) => api.post("/gerar_ingresso", dados);

export const validarIngresso = (dados) => api.post("/validar_ingresso", dados);

export const consultarIngressos = (cpf) => api.get(`/ingressos/${cpf}`);
