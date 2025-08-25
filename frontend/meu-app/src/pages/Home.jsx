import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import SideBar from "../components/SideBar";
import HomeDashboards from "../components/HomeDashboards";
import HomeDashboardsTotal from "../components/HomeDashboardsTotal";
import HomeGraphic from "../components/HomeGraphic";
import HomeGrid from "../components/HomeGrid";

const Home = ({ type }) => {
  const [valorRecebimento, setValorRecebimento] = useState(0);
  const [valorSaida, setValorSaida] = useState(0);
  const [valorDiferenca, setValorDiferenca] = useState(0);
  const [valorDetalheBanco, setValorDetalheBanco] = useState(0);
  const [valorDetalheCaixa, setValorDetalheCaixa] = useState(0);
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [igrejas, setIgrejas] = useState([]);
  const [igrejaSelecionada, setIgrejaSelecionada] = useState("");
  const [atualizar, setAtualizar] = useState(0);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const params = new URLSearchParams();
        if (igrejaSelecionada) params.append("igreja", igrejaSelecionada);
        if (mesSelecionado) params.append("mes", Number(mesSelecionado));
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/financeiro/soma-entradas?${params.toString()}`
        );
        const data = await response.json();
        setValorRecebimento(parseFloat(data.TotalEntradas || 0));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    buscarDados();
  }, [igrejaSelecionada, mesSelecionado, atualizar]);

  const valorRecebimentoFormatado = valorRecebimento;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const params = new URLSearchParams();
        if (igrejaSelecionada) params.append("igreja", igrejaSelecionada);
        if (mesSelecionado) params.append("mes", Number(mesSelecionado));
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/financeiro/soma-saidas?${params.toString()}`
        );
        const data = await response.json();
        setValorSaida(parseFloat(data.TotalSaidas || 0));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    buscarDados();
  }, [igrejaSelecionada, mesSelecionado, atualizar]);

  const valorSaidaFormatado = valorSaida;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const params = new URLSearchParams();
        if (igrejaSelecionada) params.append("igreja", igrejaSelecionada);
        if (mesSelecionado) params.append("mes", Number(mesSelecionado));
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/financeiro/diferenca?${params.toString()}`
        );
        const data = await response.json();
        setValorDiferenca(parseFloat(data.diferenca || 0));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    buscarDados();
  }, [igrejaSelecionada, mesSelecionado, atualizar]);

  const valorDiferencaFormatado = valorDiferenca;

  // useEffect(() => {
  //   const buscarDados = async () => {
  //     try {
  //       const response = await fetch(
  //         "${process.env.REACT_APP_API_URL}/financeiro/detalhe-diferenca"
  //       );
  //       const data = await response.json();
  //       setValorDetalheBanco(parseFloat(data.banco_menos_caixa || 0));
  //     } catch (error) {
  //       console.error("Erro ao buscar dados:", error);
  //     }
  //   };
  //   buscarDados();
  // }, []);

  // const valorDetalheBancoFormatado = valorDetalheBanco;

  // useEffect(() => {
  //   const buscarDados = async () => {
  //     try {
  //       const response = await fetch(
  //         "${process.env.REACT_APP_API_URL}/financeiro/detalhe-diferenca"
  //       );
  //       const data = await response.json();
  //       setValorDetalheCaixa(parseFloat(data.caixa_menos_banco || 0));
  //     } catch (error) {
  //       console.error("Erro ao buscar dados:", error);
  //     }
  //   };
  //   buscarDados();
  // }, []);

  // const valorDetalheCaixaFormatado = valorDetalheCaixa;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const params = new URLSearchParams();
        if (igrejaSelecionada) params.append("igreja", igrejaSelecionada);
        if (mesSelecionado) params.append("mes", Number(mesSelecionado));
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/financeiro/detalhe-diferenca?${params.toString()}`
        );
        const data = await response.json();

        // Se o valor for negativo, exibe 0
        setValorDetalheBanco(Math.max(parseFloat(data.saldo_banco || 0), 0));
        setValorDetalheCaixa(Math.max(parseFloat(data.saldo_caixa || 0), 0));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    buscarDados();
  }, [igrejaSelecionada, mesSelecionado, atualizar]);

  const valorDetalheBancoFormatado = valorDetalheBanco;
  const valorDetalheCaixaFormatado = valorDetalheCaixa;

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

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on("novo_lancamento", () => {
      console.log("📢 Novo Lançamento detectado!");
      setAtualizar((old) => old + 1);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <>
      <div className="home-layout">
        <SideBar />

        <div className="home__main">
          <HomeGraphic atualizar={atualizar} />

          <div className="home__main-dashboards">
            <div className="home__dashboards">
              <HomeDashboards
                title="Recebimento"
                value={valorRecebimentoFormatado}
                valorRecebimentoFormatado={valorRecebimentoFormatado}
                igrejaSelecionada={igrejaSelecionada}
                mesSelecionado={mesSelecionado}
              />
              <HomeDashboards
                title="Pagamento"
                value={valorSaidaFormatado}
                valorSaidaFormatado={valorSaidaFormatado}
                igrejaSelecionada={igrejaSelecionada}
                mesSelecionado={mesSelecionado}
              />
              <HomeDashboards
                title="Diferença"
                value={valorDiferencaFormatado}
                valorDiferencaFormatado={valorDiferencaFormatado}
                igrejaSelecionada={igrejaSelecionada}
                mesSelecionado={mesSelecionado}
              />
            </div>
            <div className="home__dashboards2">
              <HomeDashboardsTotal
                valueBanco={valorDetalheBancoFormatado}
                valueCaixa={valorDetalheCaixaFormatado}
                value={valorDiferencaFormatado}
              />
            </div>
          </div>

          <div className="home__select-grid">
            <div className="home-select">
              <label>Selecione a Igreja:</label>
              <select
                value={igrejaSelecionada}
                onChange={(e) => setIgrejaSelecionada(e.target.value)}
              >
                <option value="">-- Todas as Igrejas --</option>
                {igrejas.map((igreja) => (
                  <option key={igreja.id} value={igreja.id}>
                    {igreja.nome}
                  </option>
                ))}
              </select>

              <label>Selecione o Mês:</label>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
              >
                <option value="">-- Todos os meses --</option>
                {meses.map((mes, index) => (
                  <option key={index} value={index + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            <HomeGrid
              igrejaSelecionada={igrejaSelecionada}
              mesSelecionado={mesSelecionado}
              atualizar={atualizar}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
