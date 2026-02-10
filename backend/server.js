const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Configuração do banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web_03mb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rota para obter todos os camisetas
app.get('/api/camisetas', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM camisetas ORDER BY id DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar camisetas:', error);
    res.status(500).json({ error: 'Erro ao buscar camisetas' });
  }
});

// Rota para cadastrar nova camiseta
app.post('/api/camisetas', async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  // Validação básica
  if (!nome || !preco || estoque === undefined) {
    return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO camisetas (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
      [nome, descricao || null, preco, estoque]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      preco,
      estoque,
      data_criacao: new Date()
    });
  } catch (error) {
    console.error('Erro ao cadastrar camiseta:', error);
    res.status(500).json({ error: 'Erro ao cadastrar camiseta' });
  }
});

// Rota para deletar camiseta
app.delete('/api/camisetas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM camisetas WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Camiseta não encontrada' });
    }

    res.json({ message: 'Camiseta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar camiseta:', error);
    res.status(500).json({ error: 'Erro ao deletar camiseta' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
