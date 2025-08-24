import React from "react";

const HomeDashboardsTotal = ({ valueBanco, valueCaixa, value }) => {
  const numericValueBanco = parseFloat(valueBanco) || 0;

  const valueBancoFormatado = numericValueBanco.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numericValueCaixa = parseFloat(valueCaixa) || 0;

  const valueCaixaFormatado = numericValueCaixa.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numericValueTotal = parseFloat(value) || 0;

  const valueTotalFormatado = numericValueTotal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className="home__dashboards-info-total">
        <div className="home__dashboards-title-total">Detalhes do Saldo</div>
        <div className="home__dashboards-values-total">
          <h2 className="home__dashboards-detalhe-banco">Banco: R$ {valueBancoFormatado}</h2>
          <h2 className="home__dashboards-detalhe-caixa">Caixa: R$ {valueCaixaFormatado}</h2>
          <h2 className="home__dashboards-detalhe-total">
            Total: R$ {valueTotalFormatado}
          </h2>
        </div>
      </div>
    </>
  );
};

export default HomeDashboardsTotal;
