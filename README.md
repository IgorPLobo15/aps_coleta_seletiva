# Sistema de Gerenciamento de Coleta Seletiva Industrial

Sistema full-stack desenvolvido para gerenciar a coleta de resíduos industriais em conformidade com a ISO 14.000, conectando indústrias geradoras de resíduos com empresas coletoras licenciadas no estado de Goiás.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido como parte da APS (Atividade Prática Supervisionada) de Ciência da Computação, demonstrando a implementação de:
- **Web Services**: API RESTful com Node.js e Express
- **Aplicação Consumidora**: Frontend em HTML5, TailwindCSS e JavaScript
- **Integração Externa**: Consumo da API ViaCEP para validação de endereços

### Funcionalidades Principais

- ✅ Cadastro de indústrias e empresas coletoras (apenas Goiás)
- ✅ Criação de solicitações de coleta de resíduos
- ✅ Gerenciamento de status de coletas (Pendente → Aceita → Concluída)
- ✅ Geração automática de certificados de destinação final
- ✅ Hash de verificação único para cada certificado
- ✅ Integração com ViaCEP para preenchimento automático de endereços

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** v4.18.2 - Framework web
- **SQLite3** v5.1.6 - Banco de dados
- **CORS** v2.8.5 - Middleware para requisições cross-origin

### Frontend
- **HTML5** - Estrutura das páginas
- **TailwindCSS** (via CDN) - Framework CSS
- **JavaScript (Vanilla)** - Lógica e consumo de API
- **Fetch API** - Requisições HTTP

### Ferramentas de Desenvolvimento
- **Nodemon** v3.0.1 - Auto-reload do servidor durante desenvolvimento

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente instalado com Node.js)
- Navegador web moderno (Chrome, Firefox, Edge, etc.)

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd sistema-coleta-seletiva-industrial
```

### Passo 2: Instalar Dependências do Backend

```bash
cd backend
npm install
```

Isso instalará todas as dependências listadas no `package.json`:
- express
- sqlite3
- cors
- nodemon (dev dependency)

## 🚀 Como Executar

### Executar o Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Inicie o servidor:
```bash
npm start
```

Ou, para desenvolvimento com auto-reload:
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

Você verá a mensagem:
```
Servidor rodando na porta 3000
Banco de dados inicializado com sucesso
```

### Executar o Frontend

1. Navegue até a pasta `frontend`

2. Abra o arquivo `index.html` em seu navegador:
   - **Opção 1**: Clique duas vezes no arquivo `index.html`
   - **Opção 2**: Arraste o arquivo para o navegador
   - **Opção 3**: Use um servidor local como Live Server (VS Code)

3. A página inicial será carregada com três opções:
   - **Cadastro**: Para registrar indústrias e coletoras
   - **Indústria**: Dashboard para criar solicitações e visualizar certificados
   - **Coletora**: Dashboard para gerenciar coletas pendentes e aceitas

## 📚 Estrutura do Projeto

```
sistema-coleta-seletiva-industrial/
├── backend/
│   ├── controllers/          # Controladores da API
│   │   ├── certificadosController.js
│   │   ├── coletorasController.js
│   │   ├── industriasController.js
│   │   └── solicitacoesController.js
│   ├── routes/              # Definição de rotas
│   │   ├── certificados.js
│   │   ├── coletoras.js
│   │   ├── industrias.js
│   │   └── solicitacoes.js
│   ├── services/            # Lógica de negócio
│   │   ├── certificadosService.js
│   │   ├── coletorasService.js
│   │   ├── industriasService.js
│   │   └── solicitacoesService.js
│   ├── utils/               # Utilitários
│   │   └── hashGenerator.js
│   ├── database.db          # Banco de dados SQLite (gerado automaticamente)
│   ├── database.js          # Configuração do banco
│   ├── server.js            # Ponto de entrada da aplicação
│   ├── package.json         # Dependências e scripts
│   └── package-lock.json
├── frontend/
│   ├── js/                  # Scripts JavaScript
│   │   ├── api.js
│   │   ├── cadastro.js
│   │   ├── coletora.js
│   │   └── industria.js
│   ├── css/                 # Estilos customizados (opcional)
│   ├── index.html           # Página inicial
│   ├── cadastro.html        # Página de cadastro
│   ├── industria.html       # Dashboard da indústria
│   └── coletora.html        # Dashboard da coletora
└── README.md                # Este arquivo
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Indústrias

#### POST /industrias
Cadastra uma nova indústria

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

#### GET /industrias
Retorna todas as indústrias cadastradas

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

### Coletoras

#### POST /coletoras
Cadastra uma nova empresa coletora

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

#### GET /coletoras-goias
Retorna todas as coletoras licenciadas em Goiás

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

### Solicitações

#### POST /solicitacoes
Cria uma nova solicitação de coleta

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
  "data": "2024-11-11",
  "status": "Pendente",
  "residuo": "Plástico Industrial",
  "quantidade_kg": 500.5
}
```

#### GET /solicitacoes/industria/:id
Retorna todas as solicitações de uma indústria específica

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "industriaId": 1,
    "data": "2024-11-11",
    "status": "Concluída",
    "residuo": "Plástico Industrial",
    "quantidade_kg": 500.5
  }
]
```

#### GET /solicitacoes/pendentes
Retorna todas as solicitações com status "Pendente"

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "industriaId": 1,
    "industriaNome": "Indústria XYZ Ltda",
    "data": "2024-11-11",
    "status": "Pendente",
    "residuo": "Metal",
    "quantidade_kg": 300.0
  }
]
```

#### PUT /solicitacoes/:id/aceitar
Aceita uma solicitação pendente

**Response (200 OK):**
```json
{
  "id": 2,
  "industriaId": 1,
  "data": "2024-11-11",
  "status": "Aceita",
  "residuo": "Metal",
  "quantidade_kg": 300.0
}
```

#### POST /solicitacoes/:id/concluir
Finaliza uma solicitação aceita e gera certificado

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
    "data": "2024-11-11",
    "status": "Concluída",
    "residuo": "Metal",
    "quantidade_kg": 300.0
  },
  "certificado": {
    "id": 1,
    "solicitacaoId": 2,
    "coletoraId": 1,
    "dataEmissao": "2024-11-11",
    "hashVerificacao": "a3f5b8c9d2e1f4a7b6c5d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"
  }
}
```

### Certificados

#### GET /certificados/industria/:id
Retorna todos os certificados de uma indústria

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "solicitacaoId": 2,
    "coletoraId": 1,
    "coletoraName": "Coletora Ambiental S.A.",
    "dataEmissao": "2024-11-11",
    "hashVerificacao": "a3f5b8c9d2e1f4a7b6c5d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
    "residuo": "Metal",
    "quantidade_kg": 300.0
  }
]
```

## 💡 Exemplos de Uso

### Exemplo 1: Cadastrar uma Indústria via cURL

```bash
curl -X POST http://localhost:3000/industrias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Indústria Exemplo Ltda",
    "cnpj": "11.222.333/0001-44",
    "cep": "74000-000",
    "endereco": "Rua Teste",
    "bairro": "Centro",
    "cidade": "Goiânia",
    "uf": "GO"
  }'
```

### Exemplo 2: Listar Todas as Solicitações Pendentes

```bash
curl http://localhost:3000/solicitacoes/pendentes
```

### Exemplo 3: Aceitar uma Solicitação

```bash
curl -X PUT http://localhost:3000/solicitacoes/1/aceitar
```

### Exemplo 4: Finalizar uma Coleta

```bash
curl -X POST http://localhost:3000/solicitacoes/1/concluir \
  -H "Content-Type: application/json" \
  -d '{
    "coletoraId": 1
  }'
```

## 🎯 Fluxo de Uso do Sistema

### 1. Cadastro Inicial
1. Acesse a página de **Cadastro**
2. Cadastre uma ou mais indústrias
3. Cadastre uma ou mais empresas coletoras

### 2. Criar Solicitação (Indústria)
1. Acesse o **Dashboard da Indústria**
2. Selecione a indústria no dropdown
3. Preencha o tipo de resíduo e quantidade
4. Clique em "Solicitar Coleta"
5. A solicitação aparecerá na tabela com status "Pendente"

### 3. Aceitar Coleta (Coletora)
1. Acesse o **Dashboard da Coletora**
2. Visualize as solicitações pendentes
3. Clique em "Aceitar" na solicitação desejada
4. A solicitação mudará para status "Aceita"

### 4. Finalizar Coleta (Coletora)
1. Na seção "Coletas Aceitas"
2. Selecione a coletora responsável
3. Clique em "Finalizar Coleta"
4. Um certificado será gerado automaticamente

### 5. Visualizar Certificados (Indústria)
1. No **Dashboard da Indústria**
2. Role até a seção "Certificados"
3. Visualize todos os certificados com hash de verificação

## 🗄️ Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### Industria
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `nome` (TEXT, NOT NULL)
- `cnpj` (TEXT, NOT NULL, UNIQUE)
- `cep` (TEXT, NOT NULL)
- `endereco` (TEXT, NOT NULL)
- `bairro` (TEXT, NOT NULL)
- `cidade` (TEXT, NOT NULL)
- `uf` (TEXT, NOT NULL, CHECK = 'GO')

### Coletora
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `nome` (TEXT, NOT NULL)
- `cnpj` (TEXT, NOT NULL, UNIQUE)
- `licenca_goias` (TEXT, NOT NULL)
- `cep` (TEXT, NOT NULL)
- `endereco` (TEXT, NOT NULL)
- `bairro` (TEXT, NOT NULL)
- `cidade` (TEXT, NOT NULL)
- `uf` (TEXT, NOT NULL, CHECK = 'GO')

### Solicitacao
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `industriaId` (INTEGER, NOT NULL, FOREIGN KEY)
- `data` (TEXT, NOT NULL)
- `status` (TEXT, NOT NULL, CHECK IN ('Pendente', 'Aceita', 'Concluída'))
- `residuo` (TEXT, NOT NULL)
- `quantidade_kg` (REAL, NOT NULL)

### Certificado
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `solicitacaoId` (INTEGER, NOT NULL, UNIQUE, FOREIGN KEY)
- `coletoraId` (INTEGER, NOT NULL, FOREIGN KEY)
- `dataEmissao` (TEXT, NOT NULL)
- `hashVerificacao` (TEXT, NOT NULL, UNIQUE)

## 🔒 Validações e Regras de Negócio

- ✅ Apenas empresas de Goiás (UF = "GO") podem ser cadastradas
- ✅ CNPJ deve ser único para indústrias e coletoras
- ✅ CEP é validado automaticamente via API ViaCEP
- ✅ Solicitações só podem ser aceitas se estiverem com status "Pendente"
- ✅ Solicitações só podem ser concluídas se estiverem com status "Aceita"
- ✅ Cada solicitação gera apenas um certificado
- ✅ Hash de verificação é único para cada certificado

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
cd backend
npm install
```

### Erro: "Port 3000 already in use"
Encerre o processo que está usando a porta 3000 ou altere a porta no arquivo `server.js`

### Frontend não consegue conectar ao backend
Verifique se:
1. O backend está rodando (`npm start` na pasta backend)
2. A URL da API está correta em `frontend/js/api.js` (deve ser `http://localhost:3000`)
3. Não há bloqueio de CORS (o backend já está configurado para aceitar requisições)

### Banco de dados não inicializa
O arquivo `database.db` é criado automaticamente na primeira execução. Se houver problemas:
1. Delete o arquivo `backend/database.db`
2. Reinicie o servidor com `npm start`

## 📝 Dependências Completas

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Frontend

- **TailwindCSS**: v3.x (via CDN)
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```

## 👥 Autores

Projeto desenvolvido como APS de Ciência da Computação

## 📄 Licença

ISC License

## 🔗 APIs Externas Utilizadas

- **ViaCEP**: https://viacep.com.br/
  - Utilizada para validação e preenchimento automático de endereços
  - Endpoint: `https://viacep.com.br/ws/{cep}/json/`

## 📸 Screenshots

> **Nota**: Para adicionar os screenshots, execute o sistema e tire capturas de tela de cada página. Salve as imagens na pasta `screenshots/` e elas aparecerão aqui automaticamente.

### Página Inicial
![Página Inicial](screenshots/home.png)

A página inicial apresenta três opções de acesso ao sistema, uma para cada perfil de usuário.

### Página de Cadastro
![Página de Cadastro](screenshots/cadastro.png)

Formulários para cadastro de indústrias e empresas coletoras com integração automática com ViaCEP.

### Dashboard da Indústria
![Dashboard da Indústria](screenshots/industria.png)

Interface para criar solicitações de coleta e visualizar histórico de solicitações e certificados emitidos.

### Dashboard da Coletora
![Dashboard da Coletora](screenshots/coletora.png)

Interface para gerenciar coletas pendentes e aceitas, com opções para aceitar e finalizar coletas.

---

**Nota**: Este é um projeto acadêmico desenvolvido para fins educacionais. Para uso em produção, considere implementar autenticação, autorização, validações adicionais e testes automatizados.
