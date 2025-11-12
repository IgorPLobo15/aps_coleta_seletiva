# Design Document

## Overview

O Sistema de Gerenciamento de Coleta Seletiva Industrial é uma aplicação web full-stack que implementa uma arquitetura cliente-servidor tradicional. O backend fornece uma API RESTful que gerencia todas as operações de dados, enquanto o frontend consome essa API através de requisições HTTP usando a Fetch API.

### Arquitetura Geral

```
┌─────────────────────────────────────────┐
│         Frontend (Browser)              │
│  ┌─────────────────────────────────┐   │
│  │  cadastro.html                   │   │
│  │  industria.html                  │   │
│  │  coletora.html                   │   │
│  │  + JavaScript (Fetch API)        │   │
│  │  + TailwindCSS (CDN)             │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │ HTTP/JSON
                  │
┌─────────────────▼───────────────────────┐
│         Backend (Node.js)               │
│  ┌─────────────────────────────────┐   │
│  │  Express.js API                  │   │
│  │  - Routes                        │   │
│  │  - Controllers                   │   │
│  │  - Services                      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  SQLite Database                 │   │
│  │  - database.db                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      External API (ViaCEP)              │
│  https://viacep.com.br/ws/{cep}/json/   │
└─────────────────────────────────────────┘
```

### Tecnologias Utilizadas

**Backend:**
- Node.js (runtime JavaScript)
- Express.js (framework web)
- SQLite3 (banco de dados)
- CORS (middleware para permitir requisições cross-origin)

**Frontend:**
- HTML5 (estrutura)
- TailwindCSS via CDN (estilização)
- Vanilla JavaScript (lógica e consumo de API)
- Fetch API (requisições HTTP)

## Architecture

### Backend Architecture

O backend segue uma arquitetura em camadas simplificada:

```
┌──────────────────────────────────────┐
│         Routes Layer                 │
│  Define endpoints e métodos HTTP    │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│      Controllers Layer               │
│  Processa requisições e respostas   │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│       Services Layer                 │
│  Lógica de negócio                  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│      Database Layer                  │
│  Acesso direto ao SQLite            │
└──────────────────────────────────────┘
```

**Estrutura de Diretórios do Backend:**

```
backend/
├── server.js              # Ponto de entrada da aplicação
├── database.js            # Configuração e inicialização do SQLite
├── routes/
│   ├── industrias.js      # Rotas de indústrias
│   ├── coletoras.js       # Rotas de coletoras
│   ├── solicitacoes.js    # Rotas de solicitações
│   └── certificados.js    # Rotas de certificados
├── controllers/
│   ├── industriasController.js
│   ├── coletorasController.js
│   ├── solicitacoesController.js
│   └── certificadosController.js
├── services/
│   ├── industriasService.js
│   ├── coletorasService.js
│   ├── solicitacoesService.js
│   └── certificadosService.js
├── utils/
│   └── hashGenerator.js   # Geração de hash para certificados
├── database.db            # Arquivo do banco SQLite (gerado automaticamente)
└── package.json
```

### Frontend Architecture

O frontend é composto por três páginas HTML independentes, cada uma com seu próprio JavaScript inline ou em arquivo separado:

```
frontend/
├── index.html             # Página inicial com links para os perfis
├── cadastro.html          # Cadastro de indústrias e coletoras
├── industria.html         # Dashboard da indústria
├── coletora.html          # Dashboard da coletora
├── js/
│   ├── cadastro.js        # Lógica de cadastro
│   ├── industria.js       # Lógica do dashboard da indústria
│   ├── coletora.js        # Lógica do dashboard da coletora
│   └── api.js             # Funções auxiliares para chamadas à API
└── css/
    └── custom.css         # Estilos customizados adicionais (opcional)
```

## Components and Interfaces

### Database Schema

**Tabela: Industria**
```sql
CREATE TABLE IF NOT EXISTS Industria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    cep TEXT NOT NULL,
    endereco TEXT NOT NULL,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    uf TEXT NOT NULL CHECK(uf = 'GO')
);
```

**Tabela: Coletora**
```sql
CREATE TABLE IF NOT EXISTS Coletora (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    licenca_goias TEXT NOT NULL,
    cep TEXT NOT NULL,
    endereco TEXT NOT NULL,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    uf TEXT NOT NULL CHECK(uf = 'GO')
);
```

**Tabela: Solicitacao**
```sql
CREATE TABLE IF NOT EXISTS Solicitacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    industriaId INTEGER NOT NULL,
    data TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Aceita', 'Concluída')),
    residuo TEXT NOT NULL,
    quantidade_kg REAL NOT NULL,
    FOREIGN KEY (industriaId) REFERENCES Industria(id)
);
```

**Tabela: Certificado**
```sql
CREATE TABLE IF NOT EXISTS Certificado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitacaoId INTEGER NOT NULL UNIQUE,
    coletoraId INTEGER NOT NULL,
    dataEmissao TEXT NOT NULL,
    hashVerificacao TEXT NOT NULL UNIQUE,
    FOREIGN KEY (solicitacaoId) REFERENCES Solicitacao(id),
    FOREIGN KEY (coletoraId) REFERENCES Coletora(id)
);
```

### API Endpoints

#### 1. POST /industrias
**Descrição:** Cadastra uma nova indústria

**Request Body:**
```json
{
    "nome": "Indústria XYZ Ltda",
    "cnpj": "12.345.678/0001-90",
    "cep": "74000-000",
    "endereco": "Rua das Flores",
    "bairro": "Centro",
    "cidade": "Goiânia",
    "uf": "GO"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "nome": "Indústria XYZ Ltda",
    "cnpj": "12.345.678/0001-90",
    "cep": "74000-000",
    "endereco": "Rua das Flores",
    "bairro": "Centro",
    "cidade": "Goiânia",
    "uf": "GO"
}
```

#### 2. POST /coletoras
**Descrição:** Cadastra uma nova empresa coletora

**Request Body:**
```json
{
    "nome": "Coletora Ambiental S.A.",
    "cnpj": "98.765.432/0001-10",
    "licenca_goias": "LIC-GO-2024-001",
    "cep": "74100-000",
    "endereco": "Avenida Principal",
    "bairro": "Setor Sul",
    "cidade": "Goiânia",
    "uf": "GO"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "nome": "Coletora Ambiental S.A.",
    "cnpj": "98.765.432/0001-10",
    "licenca_goias": "LIC-GO-2024-001",
    "cep": "74100-000",
    "endereco": "Avenida Principal",
    "bairro": "Setor Sul",
    "cidade": "Goiânia",
    "uf": "GO"
}
```

#### 3. GET /industrias
**Descrição:** Retorna todas as indústrias cadastradas

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "nome": "Indústria XYZ Ltda",
        "cnpj": "12.345.678/0001-90",
        "cep": "74000-000",
        "endereco": "Rua das Flores",
        "bairro": "Centro",
        "cidade": "Goiânia",
        "uf": "GO"
    }
]
```

#### 4. GET /coletoras-goias
**Descrição:** Retorna todas as coletoras licenciadas em Goiás

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "nome": "Coletora Ambiental S.A.",
        "cnpj": "98.765.432/0001-10",
        "licenca_goias": "LIC-GO-2024-001",
        "cep": "74100-000",
        "endereco": "Avenida Principal",
        "bairro": "Setor Sul",
        "cidade": "Goiânia",
        "uf": "GO"
    }
]
```

#### 5. POST /solicitacoes
**Descrição:** Cria uma nova solicitação de coleta

**Request Body:**
```json
{
    "industriaId": 1,
    "residuo": "Plástico Industrial",
    "quantidade_kg": 500.5
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "industriaId": 1,
    "data": "2024-11-11T10:30:00.000Z",
    "status": "Pendente",
    "residuo": "Plástico Industrial",
    "quantidade_kg": 500.5
}
```

#### 6. GET /solicitacoes/industria/:id
**Descrição:** Retorna todas as solicitações de uma indústria específica

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "industriaId": 1,
        "data": "2024-11-11T10:30:00.000Z",
        "status": "Concluída",
        "residuo": "Plástico Industrial",
        "quantidade_kg": 500.5
    }
]
```

#### 7. GET /solicitacoes/pendentes
**Descrição:** Retorna todas as solicitações com status "Pendente"

**Response (200 OK):**
```json
[
    {
        "id": 2,
        "industriaId": 1,
        "industriaNome": "Indústria XYZ Ltda",
        "data": "2024-11-11T14:00:00.000Z",
        "status": "Pendente",
        "residuo": "Metal",
        "quantidade_kg": 300.0
    }
]
```

#### 8. PUT /solicitacoes/:id/aceitar
**Descrição:** Aceita uma solicitação pendente

**Response (200 OK):**
```json
{
    "id": 2,
    "industriaId": 1,
    "data": "2024-11-11T14:00:00.000Z",
    "status": "Aceita",
    "residuo": "Metal",
    "quantidade_kg": 300.0
}
```

#### 9. POST /solicitacoes/:id/concluir
**Descrição:** Finaliza uma solicitação aceita e gera certificado

**Request Body:**
```json
{
    "coletoraId": 1
}
```

**Response (200 OK):**
```json
{
    "solicitacao": {
        "id": 2,
        "industriaId": 1,
        "data": "2024-11-11T14:00:00.000Z",
        "status": "Concluída",
        "residuo": "Metal",
        "quantidade_kg": 300.0
    },
    "certificado": {
        "id": 1,
        "solicitacaoId": 2,
        "coletoraId": 1,
        "dataEmissao": "2024-11-11T15:30:00.000Z",
        "hashVerificacao": "a3f5b8c9d2e1f4a7b6c5d8e9f1a2b3c4"
    }
}
```

#### 10. GET /certificados/industria/:id
**Descrição:** Retorna todos os certificados de uma indústria

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "solicitacaoId": 2,
        "coletoraId": 1,
        "coletoraName": "Coletora Ambiental S.A.",
        "dataEmissao": "2024-11-11T15:30:00.000Z",
        "hashVerificacao": "a3f5b8c9d2e1f4a7b6c5d8e9f1a2b3c4",
        "residuo": "Metal",
        "quantidade_kg": 300.0
    }
]
```

### Frontend Components

#### 1. Página de Cadastro (cadastro.html)

**Componentes:**
- Formulário de Cadastro de Indústria
  - Campos: nome, cnpj, cep, endereco, bairro, cidade, uf
  - Integração com ViaCEP API
  - Validação de UF = "GO"
  - Botão "Salvar Indústria"

- Formulário de Cadastro de Coletora
  - Campos: nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf
  - Integração com ViaCEP API
  - Validação de UF = "GO"
  - Botão "Salvar Coletora"

**Fluxo de Integração com ViaCEP:**
```javascript
// Quando o usuário sai do campo CEP (evento onblur)
async function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado!');
            return;
        }
        
        if (data.uf !== 'GO') {
            alert('Erro: Apenas empresas de Goiás (GO) podem ser cadastradas!');
            // Limpar campos
            return;
        }
        
        // Preencher campos automaticamente
        document.getElementById('endereco').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('uf').value = data.uf;
    }
}
```

#### 2. Dashboard da Indústria (industria.html)

**Componentes:**
- Formulário de Solicitação de Coleta
  - Select de Indústrias (populado via GET /industrias)
  - Campo: residuo (tipo de resíduo)
  - Campo: quantidade_kg
  - Botão "Solicitar Coleta"

- Tabela de Solicitações
  - Colunas: ID, Data, Resíduo, Quantidade (kg), Status
  - Dados via GET /solicitacoes/industria/:id

- Tabela de Certificados
  - Colunas: ID, Data Emissão, Coletora, Resíduo, Quantidade (kg), Hash de Verificação
  - Dados via GET /certificados/industria/:id

#### 3. Dashboard da Coletora (coletora.html)

**Componentes:**
- Tabela de Coletas Pendentes
  - Colunas: ID, Indústria, Data, Resíduo, Quantidade (kg), Ação
  - Botão "Aceitar" em cada linha
  - Dados via GET /solicitacoes/pendentes

- Tabela de Coletas Aceitas
  - Colunas: ID, Indústria, Data, Resíduo, Quantidade (kg), Ação
  - Botão "Finalizar Coleta" em cada linha
  - Dados via GET /solicitacoes/aceitas (filtro no frontend ou novo endpoint)

## Data Models

### Industria Model
```javascript
{
    id: Integer (auto-increment),
    nome: String (required),
    cnpj: String (required, unique),
    cep: String (required),
    endereco: String (required),
    bairro: String (required),
    cidade: String (required),
    uf: String (required, must be 'GO')
}
```

### Coletora Model
```javascript
{
    id: Integer (auto-increment),
    nome: String (required),
    cnpj: String (required, unique),
    licenca_goias: String (required),
    cep: String (required),
    endereco: String (required),
    bairro: String (required),
    cidade: String (required),
    uf: String (required, must be 'GO')
}
```

### Solicitacao Model
```javascript
{
    id: Integer (auto-increment),
    industriaId: Integer (required, foreign key),
    data: String (ISO 8601 date, auto-generated),
    status: String (required, enum: 'Pendente', 'Aceita', 'Concluída'),
    residuo: String (required),
    quantidade_kg: Float (required)
}
```

### Certificado Model
```javascript
{
    id: Integer (auto-increment),
    solicitacaoId: Integer (required, unique, foreign key),
    coletoraId: Integer (required, foreign key),
    dataEmissao: String (ISO 8601 date, auto-generated),
    hashVerificacao: String (required, unique)
}
```

## Error Handling

### Backend Error Handling

**Estratégia Geral:**
- Todos os endpoints devem ter try-catch blocks
- Erros devem retornar status HTTP apropriados
- Mensagens de erro devem ser claras e em português

**Códigos de Status HTTP:**
- 200 OK: Operação bem-sucedida (GET, PUT)
- 201 Created: Recurso criado com sucesso (POST)
- 400 Bad Request: Dados inválidos ou faltando
- 404 Not Found: Recurso não encontrado
- 409 Conflict: Conflito (ex: CNPJ duplicado)
- 500 Internal Server Error: Erro no servidor

**Exemplo de Tratamento de Erro:**
```javascript
// Controller
async function criarIndustria(req, res) {
    try {
        const { nome, cnpj, cep, endereco, bairro, cidade, uf } = req.body;
        
        // Validação
        if (!nome || !cnpj || !cep || !endereco || !bairro || !cidade || !uf) {
            return res.status(400).json({ 
                erro: 'Todos os campos são obrigatórios' 
            });
        }
        
        if (uf !== 'GO') {
            return res.status(400).json({ 
                erro: 'Apenas empresas de Goiás podem ser cadastradas' 
            });
        }
        
        // Chamar service
        const industria = await industriasService.criar(req.body);
        
        res.status(201).json(industria);
    } catch (erro) {
        if (erro.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ 
                erro: 'CNPJ já cadastrado' 
            });
        }
        
        console.error('Erro ao criar indústria:', erro);
        res.status(500).json({ 
            erro: 'Erro interno do servidor' 
        });
    }
}
```

### Frontend Error Handling

**Estratégia:**
- Usar try-catch em todas as chamadas fetch
- Exibir mensagens de erro amigáveis usando alert() ou elementos DOM
- Validar dados antes de enviar para a API

**Exemplo:**
```javascript
async function cadastrarIndustria(dados) {
    try {
        const response = await fetch('http://localhost:3000/industrias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao cadastrar indústria');
        }
        
        const industria = await response.json();
        alert('Indústria cadastrada com sucesso!');
        limparFormulario();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert(`Erro: ${erro.message}`);
    }
}
```

### Validações Específicas

**1. Validação de CEP (Frontend):**
- CEP deve ter 8 dígitos
- Deve existir na API ViaCEP
- UF retornada deve ser "GO"

**2. Validação de CNPJ (Backend):**
- Deve ser único no banco de dados
- Formato básico (pode ser implementado regex)

**3. Validação de Status de Solicitação:**
- Aceitar: status atual deve ser "Pendente"
- Concluir: status atual deve ser "Aceita"

**4. Validação de Quantidade:**
- Deve ser um número positivo
- Deve ser maior que zero

## Testing Strategy

### Backend Testing

**Testes Manuais com Ferramentas:**
- Usar Postman ou Insomnia para testar todos os endpoints
- Verificar status codes e formato de resposta
- Testar casos de erro (dados inválidos, recursos não encontrados)

**Cenários de Teste Prioritários:**

1. **Cadastro de Indústria:**
   - Cadastro com dados válidos (UF = GO)
   - Tentativa de cadastro com UF diferente de GO (deve falhar)
   - Tentativa de cadastro com CNPJ duplicado (deve falhar)

2. **Cadastro de Coletora:**
   - Cadastro com dados válidos incluindo licença
   - Validações similares às da indústria

3. **Fluxo Completo de Solicitação:**
   - Criar solicitação (status = Pendente)
   - Aceitar solicitação (status = Aceita)
   - Concluir solicitação (status = Concluída + certificado gerado)
   - Verificar que certificado foi criado com hash único

4. **Consultas:**
   - Listar todas as indústrias
   - Listar todas as coletoras de Goiás
   - Listar solicitações de uma indústria específica
   - Listar certificados de uma indústria específica

### Frontend Testing

**Testes Manuais no Navegador:**

1. **Página de Cadastro:**
   - Testar integração com ViaCEP
   - Verificar preenchimento automático de campos
   - Testar validação de UF = GO
   - Verificar mensagens de sucesso/erro

2. **Dashboard da Indústria:**
   - Verificar carregamento do select de indústrias
   - Testar criação de solicitação
   - Verificar atualização das tabelas
   - Testar visualização de certificados

3. **Dashboard da Coletora:**
   - Verificar listagem de solicitações pendentes
   - Testar botão "Aceitar"
   - Testar botão "Finalizar Coleta"
   - Verificar atualização das tabelas após ações

### Database Testing

**Verificações:**
- Constraints de UNIQUE funcionando (CNPJ, hash)
- Constraints de CHECK funcionando (UF = 'GO', status válido)
- Foreign keys mantendo integridade referencial
- Auto-increment funcionando corretamente

### Integration Testing

**Fluxo End-to-End:**
1. Cadastrar uma indústria via frontend
2. Cadastrar uma coletora via frontend
3. Criar solicitação como indústria
4. Aceitar solicitação como coletora
5. Finalizar coleta e verificar geração de certificado
6. Visualizar certificado no dashboard da indústria

## Implementation Notes

### Hash Generation for Certificates

O hash de verificação deve ser único e baseado em informações da solicitação:

```javascript
// utils/hashGenerator.js
const crypto = require('crypto');

function gerarHashCertificado(solicitacaoId, coletoraId, dataEmissao) {
    const dados = `${solicitacaoId}-${coletoraId}-${dataEmissao}-${Date.now()}`;
    return crypto.createHash('sha256').update(dados).digest('hex');
}

module.exports = { gerarHashCertificado };
```

### CORS Configuration

O backend deve permitir requisições do frontend:

```javascript
// server.js
const cors = require('cors');

app.use(cors({
    origin: '*', // Em produção, especificar o domínio do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
```

### Database Initialization

O banco de dados deve ser inicializado automaticamente na primeira execução:

```javascript
// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Criar tabelas se não existirem
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Industria (...)`);
    db.run(`CREATE TABLE IF NOT EXISTS Coletora (...)`);
    db.run(`CREATE TABLE IF NOT EXISTS Solicitacao (...)`);
    db.run(`CREATE TABLE IF NOT EXISTS Certificado (...)`);
});

module.exports = db;
```

### Frontend API Base URL

Usar uma constante para facilitar mudanças de ambiente:

```javascript
// js/api.js
const API_BASE_URL = 'http://localhost:3000';

async function apiGet(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json();
}

async function apiPost(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json();
}

// Exportar funções auxiliares
```

### Code Documentation Standards

**Backend (Node.js):**
```javascript
/**
 * Cria uma nova indústria no banco de dados
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com os dados da indústria criada
 */
async function criarIndustria(req, res) {
    // Implementação...
}
```

**Frontend (JavaScript):**
```javascript
/**
 * Busca informações de endereço através do CEP usando a API ViaCEP
 * @param {string} cep - CEP a ser consultado (formato: 12345-678 ou 12345678)
 * @returns {Promise<Object>} Dados do endereço ou null em caso de erro
 */
async function buscarCEP(cep) {
    // Implementação...
}
```

## UI/UX Considerations

### Layout Geral com TailwindCSS

- Usar container centralizado com max-width
- Cards com sombra para formulários e tabelas
- Botões com cores semânticas (verde para ações positivas, azul para neutras)
- Espaçamento consistente usando classes do Tailwind
- Responsividade básica para diferentes tamanhos de tela

### Feedback Visual

- Loading states durante requisições (desabilitar botões, mostrar spinner)
- Mensagens de sucesso em verde
- Mensagens de erro em vermelho
- Destacar campos obrigatórios
- Validação visual de campos (borda vermelha para inválidos)

### Navegação

- Menu simples no topo com links para as três páginas
- Breadcrumbs ou título claro indicando a página atual
- Botões de ação claramente visíveis

### Acessibilidade Básica

- Labels associados aos inputs
- Atributos alt em imagens (se houver)
- Contraste adequado de cores
- Tamanho de fonte legível
