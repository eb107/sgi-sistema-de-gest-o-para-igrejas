-- Criação do banco de dados
CREATE DATABASE
 IF NOT EXISTS siie DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE siie;
show tables;
desc financeiro;
select * from financeiro;
select * from igrejas;


-- Tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('secretaria', 'tesouraria', 'admin') DEFAULT 'secretaria',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de igrejas
CREATE TABLE IF NOT EXISTS igrejas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(150),
    cidade VARCHAR(80),
    estado VARCHAR(2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pessoas
CREATE TABLE IF NOT EXISTS pessoas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    igreja_id INT,
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('Masculino', 'Feminino') NOT NULL,
    data_nascimento DATE,
    idade INT,
    estado_civil VARCHAR(50),
    funcao VARCHAR(50),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(150),
    bairro VARCHAR(80),
    cidade VARCHAR(80),
    cep VARCHAR(10),
    estado VARCHAR(2),
    rg VARCHAR(20),
    cpf VARCHAR(14),
    nacionalidade VARCHAR(50),
    naturalidade VARCHAR(50),
    profissao VARCHAR(50),
    escolaridade VARCHAR(50),
    pai VARCHAR(100),
    mae VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Ativo',
    foto VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (igreja_id) REFERENCES igrejas(id) ON DELETE SET NULL
);

-- Tabela de histórico de membros
CREATE TABLE IF NOT EXISTS historicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pessoa_id INT NOT NULL,
    tipo ENUM('chegada', 'batismo', 'disciplina', 'saida') NOT NULL,
    data_evento DATE NOT NULL,
    observacao TEXT,
    tipo_carta ENUM('recomendacao', 'mudança') DEFAULT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
);

-- Tabela de movimentações financeiras
CREATE TABLE IF NOT EXISTS financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    igreja_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50),
    categoria VARCHAR(50),
    data DATE NOT NULL,
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (igreja_id) REFERENCES igrejas(id) ON DELETE CASCADE
);