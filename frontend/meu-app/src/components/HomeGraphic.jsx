import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const GraficoIgrejas = ({ atualizar }) => {
  const [dados, setDados] = useState([]);
  const [mesesSelecionado, setMesesSelecionado] = useState(
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
    const buscarDados = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/financeiro/grafico-igrejas"
        );
        const data = await response.json();

        // Mantém o mês como número (01, 02, etc.)
        const dadosFormatados = data.map((item) => ({
          igreja: item.nome_igreja,
          valor: parseFloat(item.total),
          mes: parseInt(item.mes, 10), // transforma "01" em 1
        }));

        setDados(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    };
    buscarDados();
  }, [atualizar]);

  // Filtra os dados pelo mês selecionado
  const dadosFiltrados = mesesSelecionado
    ? dados.filter((item) => item.mes === parseInt(mesesSelecionado, 10))
    : dados;

  const exportarPDF = () => {
    const input = chartRef.current; // pega o elemento pelo ref

    if (!input) return; // segurança

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");

      const largura = pdf.internal.pageSize.getWidth();
      const altura = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Gráfico Financeiro", largura / 2, 15, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      const anoAtual = new Date().getFullYear();
      pdf.text(
        `${meses[mesesSelecionado - 1]}/${anoAtual}`,
        largura / 2,
        25,
        {
          align: "center",
        }
      );

      pdf.addImage(imgData, "PNG", 10, 35, largura - 20, altura - 80);
      pdf.save(`grafico-${meses[mesesSelecionado - 1]}.pdf`);
    });
  };
  return (
    <>
      <div className="home-select">
        <label htmlFor="mes">Selecione o Mês:</label>
        <select
          id="mes"
          value={mesesSelecionado}
          onChange={(e) => setMesesSelecionado(e.target.value)}
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

      <div ref={chartRef} >
        <ResponsiveContainer width="100%" height={700} className="responsive-graphic">
          <LineChart
            data={dadosFiltrados}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="igreja" />
            <YAxis tickCount={8} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default GraficoIgrejas;
