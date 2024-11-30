import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="sidebar">
      <ul className="menu">
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
    </div>
  );
}

export default Navbar;
