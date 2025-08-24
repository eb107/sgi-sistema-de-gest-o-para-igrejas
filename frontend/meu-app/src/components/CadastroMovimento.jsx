import React from "react";

const CadastroMovimento = () => {
  return (
    <>
      <div className="cadastro__movimento-main">
        <div className="cadastro__movimento">
          <label>Descrição</label>
          <input className="input1" type="text" placeholder="Ex: Oferta"></input>
        </div>

        <div className="cadastro__movimento">
          <label>Valor</label>
          <input type="text" placeholder="Ex: 80,00"></input>
        </div>

        <div className="cadastro__movimento-tipo">
          <div className="cadastro__movimento-tipo-label">
            <label>Tipo</label>
          </div>
          <div className="cadastro__movimento-tipo-checkbox">
            <input type="checkbox" className="custom-checkbox"></input>
            <p>Entrada</p>
            <input type="checkbox" className="custom-checkbox"></input>
            <p>Saída</p>
          </div>
        </div>

        <div className="container-btn-cadastro">
          <button className="btn-cadastro-movimento">Adicionar</button>
        </div>
      </div>
    </>
  );
};

export default CadastroMovimento;
