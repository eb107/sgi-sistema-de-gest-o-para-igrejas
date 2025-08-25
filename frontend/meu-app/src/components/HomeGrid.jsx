import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const HomeGrid = ({ igrejaSelecionada, mesSelecionado, atualizar }) => {
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const limitePorPagina = 10;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/financeiro/grid`;
        const params = new URLSearchParams();

        const temFiltro = igrejaSelecionada || mesSelecionado;

        if (igrejaSelecionada) params.append("igreja", igrejaSelecionada);
        if (mesSelecionado) params.append("mes", mesSelecionado);

        // 👇 Só aplica "hoje=true" se nenhum filtro estiver sendo usado
        if (!temFiltro) {
          params.append("hoje", "true");
        }

        params.append("page", paginaAtual);
        params.append("limit", limitePorPagina);

        url += `?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados da grid:", error);
      }
    };

    buscarDados();
  }, [igrejaSelecionada, mesSelecionado, paginaAtual, atualizar]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [igrejaSelecionada, mesSelecionado]);

  return (
    <div className="home__grid">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.tipo}</td>
              <td>{item.descricao}</td>
              <td>
                {parseFloat(item.valor).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
              <button style={{ marginLeft: "10px" }}>
                <FaEdit />
              </button>
              <button style={{ marginLeft: "10px" }}>
                <FaTrash />
              </button>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>
        <span style={{ margin: "0 1rem" }}>Página {paginaAtual}</span>
        <button
          onClick={() => setPaginaAtual((p) => p + 1)}
          disabled={dados.length < limitePorPagina}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default HomeGrid;
