import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const RelatorioIgrejas = () => {
  const { pathname } = useLocation();
  const isAnalitic = pathname === "/relatorio-igrejas-analitico";

  const [dadosGrid, setDadosGrid] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(
    String(new Date().getMonth() + 1)
  );

  const chartRef = useRef(null);

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
    const buscarRelatorio = async () => {
      try {
        let rota = isAnalitic
          ? `${
              import.meta.env.VITE_API_URL
            }/financeiro/relatorio-igrejas-analitico`
          : `${
              import.meta.env.VITE_API_URL
            }/financeiro/relatorio-igrejas-sintetico`;

        const params = new URLSearchParams();
        if (mesSelecionado) params.append("mes", mesSelecionado);

        const response = await fetch(`${rota}?${params.toString()}`);
        const data = await response.json();
        setDadosGrid(data || []);
      } catch (error) {
        console.error("Erro ao buscar relatório de igrejas", error);
      }
    };

    buscarRelatorio();
  }, [mesSelecionado, isAnalitic]);

  const exportarPDF = () => {
    const input = chartRef.current; // pega o elemento pelo ref
    if (!input) return; // segurança

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");

      const larguraPagina = pdf.internal.pageSize.getWidth();
      const alturaPagina = pdf.internal.pageSize.getHeight();

      // Dimensões originais da imagem (px)
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Define largura fixa em mm e calcula altura proporcional
      const larguraFinal = larguraPagina - 20; // 10mm de margem de cada lado
      const proporcao = imgWidth / imgHeight;
      const alturaFinal = larguraFinal / proporcao;

      const tipoRelatorio = isAnalitic ? "Analítico" : "Sintético";

      // Cabeçalho do PDF
      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Relatório Financeiro ${tipoRelatorio}`, larguraPagina / 2, 15, {
        align: "center",
      });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      const anoAtual = new Date().getFullYear();
      pdf.text(
        `${meses[mesSelecionado - 1]}/${anoAtual}`,
        larguraPagina / 2,
        25,
        { align: "center" }
      );

      // Centraliza a tabela
      const x = (larguraPagina - larguraFinal) / 2;
      const y = 35;

      pdf.addImage(imgData, "PNG", x, y, larguraFinal, alturaFinal);

      // Nome do arquivo dinâmico

      pdf.save(`Relatorio-${tipoRelatorio}-${meses[mesSelecionado - 1]}.pdf`);
    });
  };

  return (
    <div className="relatorio-igrejas__main">
      <div className="relatorio-igrejas__main-tittle-select">
        <h1>Relatório de Igrejas ({isAnalitic ? "Analítico" : "Sintético"})</h1>

        <div className="home-select">
          <label htmlFor="mes">Selecione o Mês:</label>
          <select
            id="mes"
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
          >
            {meses.map((mes, index) => (
              <option key={index} value={index + 1}>
                {mes}
              </option>
            ))}
          </select>

          <button
            className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg"
            onClick={exportarPDF}
          >
            <p>Exportar para PDF</p>
          </button>
        </div>
      </div>

      <div className="home__grid">
        <table style={{ marginTop: 0 }} ref={chartRef}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Igreja</th>
              <th>Entrada</th>
              <th>Aluguel</th>
              <th>Ajuda de Custo</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {dadosGrid.map((linha) => (
              <tr key={linha.lancamento_id || linha.igreja_id}>
                <td>{linha.lancamento_id || linha.igreja_id}</td>
                <td>{linha.igreja_nome}</td>
                <td>{linha.entrada || 0}</td>
                <td>{linha.aluguel || 0}</td>
                <td>{linha.ajuda_de_custo || 0}</td>
                <td>
                  {(linha.entrada || 0) -
                    (linha.aluguel || 0) -
                    (linha.ajuda_de_custo || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioIgrejas;
