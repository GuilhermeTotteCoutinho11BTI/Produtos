# Football Shirts API

API REST para gerenciamento de camisetas de futebol.

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn

## Instalação

```bash
cd backend
npm install
```

## Executar o servidor

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor rodará em `http://localhost:3000`

## Rotas da API

### Health Check
- **GET** `/api/health` - Verifica se a API está funcionando

### Camisetas

#### Listar todas as camisetas
- **GET** `/api/camisetas`
- Retorna: Array de todas as camisetas

#### Buscar camiseta por ID
- **GET** `/api/camisetas/:id`
- Parâmetros: `id` (integer)
- Retorna: Objeto da camiseta encontrada
- Status: 404 se não encontrado

#### Criar nova camiseta
- **POST** `/api/camisetas`
- Body:
```json
{
  "nome": "Brasil Home 2024",
  "descricao": "Camiseta oficial da Seleção Brasileira",
  "preco": 199.90,
  "estoque": 50
}
```
- Retorna: Camiseta criada com ID

#### Atualizar camiseta
- **PUT** `/api/camisetas/:id`
- Parâmetros: `id` (integer)
- Body:
```json
{
  "nome": "Brasil Home 2024",
  "descricao": "Camiseta oficial da Seleção Brasileira",
  "preco": 199.90,
  "estoque": 45
}
```
- Retorna: Camiseta atualizada
- Status: 404 se não encontrado

#### Deletar camiseta
- **DELETE** `/api/camisetas/:id`
- Parâmetros: `id` (integer)
- Retorna: Mensagem de confirmação
- Status: 404 se não encontrado

## Banco de Dados

O backend utiliza SQLite com a seguinte estrutura:

```sql
CREATE TABLE camisetas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

A base de dados é criada automaticamente na primeira execução em `camisetas.db`.

## Estrutura do Projeto

```
backend/
├── server.js          # Arquivo principal com rotas e lógica
├── package.json       # Dependências do projeto
├── camisetas.db       # Banco de dados SQLite (criado automaticamente)
└── README.md          # Este arquivo
```

## Notas

- A API implementa CORS para aceitar requisições do frontend
- Todos os campos obrigatórios são validados
- Timestamps são criados automaticamente para cada camiseta
- O banco de dados é persistent e salvo no arquivo `camisetas.db`
