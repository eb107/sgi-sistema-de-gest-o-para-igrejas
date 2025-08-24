import React, { useState, useEffect } from "react";

const HomeDashboards = ({
  title,
  value,
  valorRecebimentoFormatado,
  valorSaidaFormatado,
  igrejaSelecionada,
  mesSelecionado,
}) => {
  const numericValue = parseFloat(value) || 0;
  const [dados, setDados] = useState([]);

  const valueFormatado = numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className="home__dashboards-info">
        <div className="home__dashboards-title">{title}</div>
        <div className="home__dashboards-values">
          <h2
            className={`${
              value === valorRecebimentoFormatado
                ? ""
                : value === valorSaidaFormatado
                ? ""
                : numericValue < 0
                ? "valor__vermelho"
                : value >= 0
                ? "valor__verde"
                : ""
            }`}
          >{`R$ ${valueFormatado}`}</h2>
        </div>
      </div>
    </>
  );
};

export default HomeDashboards;
