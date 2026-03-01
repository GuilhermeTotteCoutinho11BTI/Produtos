const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'camisetas.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS camisetas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      estoque INTEGER NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela de camisetas inicializada');
    }
  });
}

// Routes

// GET all camisetas
app.get('/api/camisetas', (req, res) => {
  db.all('SELECT * FROM camisetas ORDER BY data_criacao DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET camiseta by ID
app.get('/api/camisetas/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM camisetas WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Camiseta não encontrada' });
      return;
    }
    res.json(row);
  });
});

// POST new camiseta
app.post('/api/camisetas', (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || preco === undefined || estoque === undefined) {
    res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
    return;
  }

  db.run(
    'INSERT INTO camisetas (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
    [nome, descricao || '', preco, estoque],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        nome,
        descricao: descricao || '',
        preco,
        estoque
      });
    }
  );
});

// PUT update camiseta
app.put('/api/camisetas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque } = req.body;

  if (!nome || preco === undefined || estoque === undefined) {
    res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
    return;
  }

  db.run(
    'UPDATE camisetas SET nome = ?, descricao = ?, preco = ?, estoque = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?',
    [nome, descricao || '', preco, estoque, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Camiseta não encontrada' });
        return;
      }
      res.json({
        id: parseInt(id),
        nome,
        descricao: descricao || '',
        preco,
        estoque,
        message: 'Camiseta atualizada com sucesso'
      });
    }
  );
});

// DELETE camiseta
app.delete('/api/camisetas/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM camisetas WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Camiseta não encontrada' });
      return;
    }
    res.json({ message: 'Camiseta deletada com sucesso' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando corretamente' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('Banco de dados fechado');
    }
    process.exit(0);
  });
});
