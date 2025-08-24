import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";

const Splash = () => {
  const frases = ["Bem-Vindos!", "Controle", "Gestão", "Resultado"];
  const [indexFrase, setIndexFrase] = useState(0);
  const [texto, setTexto] = useState("");
  const [apagando, setApagando] = useState(false);

  useEffect(() => {
    const fraseAtual = frases[indexFrase];
    let timer;

    if (apagando) {
      timer = setTimeout(() => {
        setTexto((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTexto((prev) => fraseAtual.slice(0, prev.length + 1));
      }, 100);
    }

    if (!apagando && texto === fraseAtual) {
      setTimeout(() => setApagando(true), 1000);
    }

    if (apagando && texto === "") {
      setApagando(false);
      setIndexFrase((prev) => (prev + 1) % frases.length);
    }

    return () => clearTimeout(timer);
  }, [texto, apagando, frases, indexFrase]);

  return (
    <>
      <div className="splash__main">
        <div className="splash__presents">
          <h1 className="splash__text1">Olá!</h1>
          <p className="splash__text2">
            SGI: <span className="typed-text">{texto}</span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Splash;
