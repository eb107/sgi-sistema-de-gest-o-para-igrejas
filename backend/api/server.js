const express = require("express");
const mysql = require("mysql2");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Criar servidor HTTP
const server = http.createServer(app);

// Criar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Guardar io no app para uso nas rotas
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Configuração banco MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

// Rotas

app.get("/", (req, res) => {
  res.send("API está rodando!");
});

app.get("/financeiro", (req, res) => {
  db.query("SELECT * FROM financeiro", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get("/financeiro/todos", (req, res) => {
  db.query("SELECT * FROM financeiro", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get("/financeiro/soma-entradas", (req, res) => {
  const { igreja, mes } = req.query;

  let query =
    "SELECT SUM(valor) AS TotalEntradas FROM financeiro WHERE tipo = 'entrada'";
  const params = [];

  if (igreja) {
    query += ` AND igreja_id = ?`;
    params.push(igreja);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao somar entradas!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result[0]);
  });
});

app.get("/financeiro/soma-aluguel", (req, res) => {
  const { igreja, mes } = req.query;

  let query =
    "SELECT SUM(valor) AS TotalAluguel FROM financeiro WHERE conta = 'aluguel'";
  const params = [];

  if (igreja) {
    query += ` AND igreja_id = ?`;
    params.push(igreja);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao somar Alugeis!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result[0]);
  });
});

app.get("/financeiro/soma-saidas", (req, res) => {
  const { igreja, mes } = req.query;

  let query =
    "SELECT SUM(valor) AS TotalSaidas FROM financeiro WHERE tipo = 'saida'";
  const params = [];

  if (igreja) {
    query += ` AND igreja_id = ?`;
    params.push(igreja);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao somar saidas!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result[0]);
  });
});

app.get("/financeiro/entrada-relatorio", (req, res) => {
  const { igreja, mes } = req.query;

  let query = `
    SELECT id, igreja_id, valor 
    FROM financeiro
    WHERE tipo = 'entrada'
  `;
  const params = [];

  if (igreja) {
    query += ` AND igreja_id = ?`;
    params.push(igreja);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao buscar entradas!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/saida-alugueis", (req, res) => {
  const { id, mes } = req.query;

  let query = `
    SELECT id, igreja_id, valor 
    FROM financeiro
    WHERE tipo = 'saida' AND conta = 'aluguel'
  `;
  const params = [];

  if (id) {
    query += ` AND id = ?`;
    params.push(id);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao buscar Alugueis!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/saida-ajuda-de-custo", (req, res) => {
  const { igreja, mes } = req.query;

  let query = `
    SELECT id, igreja_id, valor 
    FROM financeiro
    WHERE tipo = 'saida' AND conta = 'ajuda de custo'
  `;
  const params = [];

  if (igreja) {
    query += ` AND id = ?`;
    params.push(igreja);
  }

  if (mes) {
    query += ` AND MONTH(data) = ?`;
    params.push(mes);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao buscar Ajuda de custo!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/relatorio-igrejas-analitico", (req, res) => {
  const { mes } = req.query;

  let query = `
    SELECT 
      f.id AS lancamento_id,
      i.id AS igreja_id,
      i.nome AS igreja_nome,
      CASE WHEN f.tipo = 'entrada' THEN f.valor END AS entrada,
      CASE WHEN f.tipo = 'saida' AND f.conta = 'aluguel' THEN f.valor END AS aluguel,
      CASE WHEN f.tipo = 'saida' AND f.conta = 'ajuda de custo' THEN f.valor END AS ajuda_de_custo,
      f.data,
      f.conta,
      f.tipo
    FROM financeiro f
    INNER JOIN igrejas i ON f.igreja_id = i.id
  `;

  const params = [];

  if (mes) {
    query += ` WHERE MONTH(f.data) = ? `;
    params.push(mes);
  }

  query += ` ORDER BY i.nome, f.data`;

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao buscar relatório de igrejas:", err);
      return res.status(500).json({ error: "Erro ao buscar relatório!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/relatorio-igrejas-sintetico", (req, res) => {
  const { mes } = req.query;

  let query = `
    SELECT 
      i.id AS igreja_id,
      i.nome AS igreja_nome,
      SUM(CASE WHEN f.tipo = 'entrada' THEN f.valor ELSE 0 END) AS entrada,
      SUM(CASE WHEN f.tipo = 'saida' AND f.conta = 'aluguel' THEN f.valor ELSE 0 END) AS aluguel,
      SUM(CASE WHEN f.tipo = 'saida' AND f.conta = 'ajuda de custo' THEN f.valor ELSE 0 END) AS ajuda_de_custo
    FROM financeiro f
    INNER JOIN igrejas i ON f.igreja_id = i.id
  `;

  const params = [];

  if (mes) {
    query += ` WHERE MONTH(f.data) = ? `;
    params.push(mes);
  }

  query += `
    GROUP BY i.id, i.nome
    ORDER BY i.nome
  `;

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao buscar relatório de igrejas:", err);
      return res.status(500).json({ error: "Erro ao buscar relatório!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/diferenca", (req, res) => {
  const { igreja, mes } = req.query;

  let query = `
    SELECT
      (SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'entrada' 
        ${igreja ? "AND igreja_id = ?" : ""}
        ${mes ? "AND MONTH(data) = ?" : ""}
      )
      -
      (SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'saida' 
        ${igreja ? "AND igreja_id = ?" : ""}
        ${mes ? "AND MONTH(data) = ?" : ""}
      ) AS diferenca
  `;

  const params = [];

  if (igreja) params.push(igreja);
  if (mes) params.push(mes);

  if (igreja) params.push(igreja);
  if (mes) params.push(mes);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao somar diferença!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result[0]);
  });
});

app.get("/financeiro/detalhe-diferenca", (req, res) => {
  const { igreja, mes } = req.query;

  let query = `
    SELECT
      GREATEST(entradas_banco - saidas_banco, 0) AS saldo_banco,
      GREATEST(entradas_caixa - saidas_caixa, 0) AS saldo_caixa
    FROM (
      SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' AND banco = 'banco' THEN valor END), 0) AS entradas_banco,
        COALESCE(SUM(CASE WHEN tipo = 'saida' AND banco = 'banco' THEN valor END), 0) AS saidas_banco,
        COALESCE(SUM(CASE WHEN tipo = 'entrada' AND banco = 'caixa' THEN valor END), 0) AS entradas_caixa,
        COALESCE(SUM(CASE WHEN tipo = 'saida' AND banco = 'caixa' THEN valor END), 0) AS saidas_caixa
      FROM financeiro
      WHERE 1 = 1
  `;

  const params = [];

  if (igreja) {
    query += " AND igreja_id = ?";
    params.push(igreja);
  }

  if (mes) {
    query += " AND MONTH(data) = ?";
    params.push(mes);
  }

  query += `
    ) AS saldos
  `;

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Erro ao somar diferença!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result[0]);
  });
});

app.get("/financeiro/grafico-igrejas", (req, res) => {
  const query = `
    SELECT 
      i.nome AS nome_igreja, 
      DATE_FORMAT(f.data, '%m') AS mes, 
      SUM(f.valor) AS total 
    FROM financeiro f 
    JOIN igrejas i ON i.id = f.igreja_id 
    WHERE f.tipo = 'entrada' 
    GROUP BY i.nome, mes 
    ORDER BY mes, total;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao somar total!", err);
      return res.status(500).json({ error: "Erro ao buscar dados!" });
    }
    res.json(result);
  });
});

app.get("/financeiro/grid", (req, res) => {
  const { igreja, mes, hoje, page = 1, limit = 10 } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = `
    SELECT f.id, f.tipo, f.descricao, f.valor, f.data, i.nome as igreja_nome
    FROM financeiro f
    JOIN igrejas i ON f.igreja_id = i.id
    WHERE 1 = 1
  `;
  const params = [];

  if (igreja) {
    query += " AND f.igreja_id = ?";
    params.push(igreja);
  }

  if (mes) {
    query += " AND MONTH(f.data) = ?";
    params.push(mes);
  }

  if (hoje === "true") {
    query += " AND DATE(f.data) = CURDATE()";
  }

  query += " ORDER BY f.data DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados financeiros:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar dados financeiros." });
    }

    res.json(results);
  });
});

app.get("/select-igrejas", (req, res) => {
  const query = "SELECT id, nome FROM igrejas ORDER BY nome";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar igrejas:", err);
      return res.status(500).json({ error: "Erro ao buscar igrejas." });
    }

    res.json(results);
  });
});

app.post("/financeiro/lancamento-financeiro", (req, res) => {
  const {
    igreja_id,
    tipo,
    conta,
    valor,
    banco,
    forma_pagamento,
    departamento,
    data,
    descricao,
  } = req.body;

  const sql = `INSERT INTO financeiro (igreja_id, tipo, conta, valor, banco, forma_pagamento, departamento, data, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      igreja_id,
      tipo,
      conta,
      valor,
      banco,
      forma_pagamento,
      departamento,
      data,
      descricao,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir lançamento!:", err);
        return res.status(500).json({ error: "Erro ao inserir no banco" });
      }

      // Emitir evento de novo lançamento
      const io = req.app.get("io");
      io.emit("novo_lancamento");

      res.json({
        message: "Lançamento inserido com sucesso!",
        id: result.insertId,
      });
    }
  );
});

// Iniciar servidor HTTP via "server.listen", não app.listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
