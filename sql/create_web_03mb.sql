-- Script MySQL para criar banco web_03mb e tabela de camisetas de futebol
CREATE DATABASE IF NOT EXISTS web_03mb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_03mb;

CREATE TABLE IF NOT EXISTS camisetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL COMMENT 'Nome do time ou camiseta',
  descricao TEXT COMMENT 'Descrição: temporada, estilo, material',
  preco DECIMAL(10,2) NOT NULL COMMENT 'Preço em reais',
  estoque INT NOT NULL DEFAULT 0 COMMENT 'Quantidade em estoque',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de cadastro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela de camisetas de futebol disponíveis na loja';

-- Exemplos de dados (opcional):
-- INSERT INTO camisetas (nome, descricao, preco, estoque) VALUES 
-- ('Brasil Home 2024', 'Camiseta oficial da seleção, estrutura premium', 249.90, 10),
-- ('Manchester United 2024-25', 'Uniforme oficial, material respirável', 399.90, 8),
-- ('Barcelona Home 2024-25', 'Camiseta oficial blaugrana, estilo moderno', 349.90, 12);


