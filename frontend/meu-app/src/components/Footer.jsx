import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  const isFooter = pathname === "/";

  return (
    <>
      {isFooter ? (
        <div className="footer__main">
          <p>
            © <span className="footer__marca">SGI</span>
            <span> 2025 Todos os Direitos Reservados</span>
          </p>
          <p>Feito por epmsoft</p>
        </div>
      ) : (
        <div className="footer__main">
          <p>
            © <span className="footer__marca">SGI</span>
            <span> 2025 Todos os Direitos Reservados</span>
          </p>
          <p>Feito por epmsoft</p>
        </div>
      )}
    </>
  );
};

export default Footer;
