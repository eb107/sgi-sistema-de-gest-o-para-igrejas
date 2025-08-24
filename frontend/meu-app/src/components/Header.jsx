import React from "react";
import "../App.css";
import Imageperfil from "../../../../frontend/meu-app/src/images/logo.jpg";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();
  const isSplash = pathname === "/";

  return (
    <>
      <div className="header_main">
        <img
          className="header_logo"
          src={Imageperfil}
          alt="Imagem do Usuário"
          width={50}
          height={50}
        />

        <p>SGI - Sistema de gestão para Igrejas</p>
        <div className="header_section">
          {isSplash ? (
            <Link to="/home" className="header_link">
              Login
            </Link>
          ) : (
            <Link to="/" className="header_link">
              Sair
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
