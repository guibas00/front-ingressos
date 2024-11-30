import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, Box, Drawer, List, ListItem, ListItemText, CssBaseline, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Ícone do Menu
import EventIcon from "@mui/icons-material/Event"; // Ícone para Gerar Ingresso
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Ícone para Validar Ingresso
import SearchIcon from "@mui/icons-material/Search"; // Ícone para Consultar Ingressos
import GerarIngresso from "./components/GerarIngresso";
import ValidarIngresso from "./components/ValidarIngresso";
import ConsultarIngressos from "./components/ConsultarIngressos";

function App() {
  const [open, setOpen] = useState(false); // Controla a abertura do menu lateral

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Fecha o menu lateral quando um item é clicado
  const handleItemClick = () => {
    setOpen(false); // Fecha o menu quando um item é clicado
  };

  const menuItems = [
    { label: "Gerar Ingresso", path: "/gerar", icon: <EventIcon /> },
    { label: "Validar Ingresso", path: "/validar", icon: <CheckCircleIcon /> },
    { label: "Consultar Ingressos", path: "/consultar", icon: <SearchIcon /> },
  ];

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Menu Lateral */}
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              borderRight: "0.01px solid #000", // Borda para destacar o menu lateral
              backgroundColor: "#ffff", // Cor de fundo do menu
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} component={Link} to={item.path} onClick={handleItemClick}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <ListItemText primary={item.label} sx={{ marginLeft: 2 }} />
                </Box>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Conteúdo Principal */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {/* Ícone do Menu */}
          <IconButton
            color="primary"
            aria-label="Abrir Menu"
            onClick={toggleDrawer}
            sx={{ display: open ? "none" : "block", position: "absolute", top: 16, left: 16 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Conteúdo da Página */}
          <Container maxWidth="md" sx={{ paddingTop: 4 }}>
            <Routes>
              <Route path="/gerar" element={<GerarIngresso />} />
              <Route path="/validar" element={<ValidarIngresso />} />
              <Route path="/consultar" element={<ConsultarIngressos />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
