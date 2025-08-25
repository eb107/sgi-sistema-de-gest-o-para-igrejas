import React, { useState, useEffect } from "react";
import Imageperfil from "../../../../frontend/meu-app/src/images/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import Modal from "./Modal";

const SideBar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/home";

  const [open, setOpen] = useState(false); // sidebar aberta/fechada em mobile
  const [openItem, setOpenItem] = useState(null); // submenu aberto
  const [isFormOpen, setIsFormOpen] = useState(false); // modal

  const toggleSubMenu = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const [igrejas, setIgrejas] = useState([]);
  const [igrejaSelecionada, setIgrejaSelecionada] = useState("");

  useEffect(() => {
    const fetchIgrejas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/select-igrejas`
        );
        const data = await response.json();
        setIgrejas(data);
      } catch (error) {
        console.error("Erro ao buscar igrejas:", error);
      }
    };
    fetchIgrejas();
  }, []);

  const [tipo, setTipo] = useState("");
  const [conta, setConta] = useState("");
  const [valor, setValor] = useState("");
  const [banco, setBanco] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");

  const enviarLancamento = async (e) => {
    e.preventDefault();
    const dados = {
      igreja_id: igrejaSelecionada,
      tipo,
      conta,
      valor,
      banco,
      forma_pagamento: formaPagamento,
      departamento,
      data,
      descricao,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/financeiro/lancamento-financeiro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        }
      );

      const json = await res.json();
      alert(json.message || "Salvo!");

      setIgrejaSelecionada("");
      setTipo("");
      setConta("");
      setValor("");
      setBanco("");
      setFormaPagamento("");
      setDepartamento("");
      setData("");
      setDescricao("");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <>
      {/* Botão hambúrguer */}
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>
      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Imagem de perfil */}
        {/* <div className="ImageButton">
          <img
            src={Imageperfil}
            alt="Imagem do Usuário"
            width={120}
            height={120}
          />
          <span>Usuário</span>
        </div> */}

        <ul>
          <Link to="/">
            <li>Dashboard</li>
          </Link>

          {/* Tesouraria */}
          <li className="menu-item">
            <span>Tesouraria</span>
            <button
              className={`btn-expandir ${
                openItem === "tesouraria" ? "open" : ""
              }`}
              onClick={() => toggleSubMenu("tesouraria")}
            >
              <MdKeyboardArrowDown size={20} />
            </button>
          </li>
          <ul className={`submenu ${openItem === "tesouraria" ? "open" : ""}`}>
            <li onClick={openForm}>Lançamento Financeiro</li>
          </ul>

          {/* Secretaria */}
          <li className="menu-item">
            <span>Secretaria</span>
            <button
              className={`btn-expandir ${
                openItem === "secretaria" ? "open" : ""
              }`}
              onClick={() => toggleSubMenu("secretaria")}
            >
              <MdKeyboardArrowDown size={20} />
            </button>
          </li>
          <ul className={`submenu ${openItem === "secretaria" ? "open" : ""}`}>
            <Link to="/">
              <li>Igrejas</li>
            </Link>
            <Link to="/">
              <li>Membros</li>
            </Link>
          </ul>

          {/* Relatórios */}
          <li className="menu-item">
            <span>Relatórios</span>
            <button
              className={`btn-expandir ${
                openItem === "relatório" ? "open" : ""
              }`}
              onClick={() => toggleSubMenu("relatório")}
            >
              <MdKeyboardArrowDown size={20} />
            </button>
          </li>
          <ul className={`submenu ${openItem === "relatório" ? "open" : ""}`}>
            <Link to="/relatorio-igrejas-analitico">
              <li>Analítico</li>
            </Link>
            <Link to="/relatorio-igrejas-sintetico">
              <li>Sintético</li>
            </Link>
          </ul>

          <Link to="/">
            <li>Editar Perfil</li>
          </Link>
          <Link to="/">
            <li>Configurações</li>
          </Link>
          <Link to="/">
            <li>Informações</li>
          </Link>
        </ul>
      </aside>
      {/* Modal de Lançamento Financeiro */}{" "}
      <Modal isOpen={isFormOpen} onClose={closeForm}>
        {" "}
        <div className="formLancFinanc">
          {" "}
          <h2>Lançamento Financeiro</h2> <br />{" "}
          <form className="formLancFinanc" onSubmit={enviarLancamento}>
            {" "}
            <div className="formLancFinanc-select">
              {" "}
              <div className="home-select">
                {" "}
                <label className="home-select-label">Tipo:</label>{" "}
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {" "}
                  <option value="">Selecione</option> <option>Entrada</option>{" "}
                  <option>Saída</option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="home-select">
                {" "}
                <label className="home-select-label">Banco:</label>{" "}
                <select
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                >
                  {" "}
                  <option value="">Selecione</option> <option>Caixa</option>{" "}
                  <option>Banco</option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="home-select">
                {" "}
                <label className="home-select-label">
                  Forma Pagamento:
                </label>{" "}
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  {" "}
                  <option value="">Selecione</option> <option>Dinheiro</option>{" "}
                  <option>Pix</option> <option>Cartão</option>{" "}
                </select>{" "}
              </div>{" "}
            </div>{" "}
            <br />{" "}
            <div className="formLancFinanc-inputs">
              {" "}
              <div className="home-select-igreja">
                {" "}
                <label className="home-select-label">Departamento:</label>{" "}
                <select
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                >
                  {" "}
                  <option value="">Selecione</option>{" "}
                  <option>Tesouraria</option> <option>Secretaria</option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="home-select-igreja">
                {" "}
                <label className="home-select-label">
                  Plano de contas:
                </label>{" "}
                <select
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                >
                  {" "}
                  <option value="">Selecione</option>{" "}
                  <option>Igrejas filiadas</option>{" "}
                  <option>Ajuda de custo</option> <option>Aluguel</option>{" "}
                </select>{" "}
              </div>{" "}
              <div className="formLancFinanc-input">
                {" "}
                <label className="home-select-label">Valor:</label>{" "}
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex: 0,00"
                />{" "}
              </div>{" "}
            </div>{" "}
            <br />{" "}
            <div className="formLancFinanc-select-date">
              {" "}
              <div className="home-select-igreja">
                {" "}
                <select
                  value={igrejaSelecionada}
                  onChange={(e) => setIgrejaSelecionada(e.target.value)}
                >
                  {" "}
                  <option value=""> Selecione uma Igreja </option>{" "}
                  {igrejas.map((igreja) => (
                    <option key={igreja.id} value={igreja.id}>
                      {" "}
                      {igreja.nome}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
              </div>{" "}
              <div className="formLancFinanc-date">
                {" "}
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />{" "}
              </div>{" "}
            </div>{" "}
            <br />{" "}
            <div className="formLancFinanc-desc">
              {" "}
              <label className="home-select-label">Descrição:</label>{" "}
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
              />{" "}
            </div>{" "}
            <br />
            <button type="submit">Salvar ✔️</button>{" "}
          </form>{" "}
        </div>{" "}
      </Modal>
    </>
  );
};

export default SideBar;
