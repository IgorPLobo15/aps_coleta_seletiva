# 📊 Estrutura de Dados do Banco - Sistema de Coleta Seletiva Industrial

## 🗄️ Visão Geral

O banco de dados utiliza **SQLite** e é composto por **4 tabelas principais** que gerenciam o ciclo completo de coleta de resíduos industriais:

1. **Industria** - Cadastro de indústrias geradoras de resíduos
2. **Coletora** - Cadastro de empresas coletoras licenciadas
3. **Solicitacao** - Solicitações de coleta criadas pelas indústrias
4. **Certificado** - Certificados de destinação final gerados após coleta concluída

---

## 📐 Diagrama de Relacionamento (ER - Entidade Relacionamento)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │   Industria  │                    │   Coletora   │          │
│  ├──────────────┤                    ├──────────────┤          │
│  │ id (PK)      │                    │ id (PK)      │          │
│  │ nome         │                    │ nome         │          │
│  │ cnpj (UNIQUE)│                    │ cnpj (UNIQUE)│          │
│  │ cep          │                    │ licenca_goias│          │
│  │ endereco     │                    │ cep          │          │
│  │ bairro       │                    │ endereco     │          │
│  │ cidade       │                    │ bairro       │          │
│  │ uf (GO)      │                    │ cidade       │          │
│  └──────┬───────┘                    │ uf (GO)      │          │
│         │                            └──────┬───────┘          │
│         │                                   │                  │
│         │                                   │                  │
│         │ 1:N                              │                  │
│         │                                   │                  │
│         ▼                                   │                  │
│  ┌──────────────┐                          │                  │
│  │ Solicitacao  │                          │                  │
│  ├──────────────┤                          │                  │
│  │ id (PK)      │                          │                  │
│  │ industriaId  │◄───┐                    │                  │
│  │   (FK)       │    │                    │                  │
│  │ data         │    │                    │                  │
│  │ status       │    │                    │                  │
│  │   (Enum)     │    │                    │                  │
│  │ residuo      │    │                    │                  │
│  │ quantidade_kg│    │                    │                  │
│  └──────┬───────┘    │                    │                  │
│         │            │                    │                  │
│         │            │                    │                  │
│         │ 1:1        │                    │                  │
│         │            │                    │                  │
│         ▼            │                    │                  │
│  ┌──────────────┐    │                    │                  │
│  │ Certificado  │    │                    │                  │
│  ├──────────────┤    │                    │                  │
│  │ id (PK)      │    │                    │                  │
│  │ solicitacaoId│────┘                    │                  │
│  │   (FK,UNIQUE)│                         │                  │
│  │ coletoraId   │─────────────────────────┘                  │
│  │   (FK)       │                                             │
│  │ dataEmissao  │                                             │
│  │ hashVerific  │                                             │
│  │   (UNIQUE)   │                                             │
│  └──────────────┘                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Legenda:
- PK = Primary Key (Chave Primária)
- FK = Foreign Key (Chave Estrangeira)
- 1:N = Relacionamento Um-para-Muitos
- 1:1 = Relacionamento Um-para-Um
```

---

## 📋 Estrutura Detalhada das Tabelas

### 1. Tabela `Industria`

Armazena informações das indústrias cadastradas no sistema que geram resíduos industriais.

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

**Campos:**
| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INTEGER | Identificador único da indústria | PRIMARY KEY, AUTOINCREMENT |
| `nome` | TEXT | Razão social da indústria | NOT NULL |
| `cnpj` | TEXT | CNPJ da indústria | NOT NULL, UNIQUE |
| `cep` | TEXT | CEP do endereço | NOT NULL |
| `endereco` | TEXT | Rua/avenida do endereço | NOT NULL |
| `bairro` | TEXT | Bairro do endereço | NOT NULL |
| `cidade` | TEXT | Cidade do endereço | NOT NULL |
| `uf` | TEXT | Unidade Federativa | NOT NULL, CHECK = 'GO' |

**Regras de Negócio:**

- ✅ Apenas empresas do estado de Goiás (UF = 'GO') podem ser cadastradas
- ✅ CNPJ deve ser único no sistema (não pode haver duplicatas)
- ✅ Todos os campos são obrigatórios (NOT NULL)

**Relacionamentos:**

- **1:N** com `Solicitacao` (uma indústria pode ter múltiplas solicitações)

---

### 2. Tabela `Coletora`

Armazena informações das empresas coletoras licenciadas no estado de Goiás.

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

**Campos:**
| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INTEGER | Identificador único da coletora | PRIMARY KEY, AUTOINCREMENT |
| `nome` | TEXT | Razão social da coletora | NOT NULL |
| `cnpj` | TEXT | CNPJ da coletora | NOT NULL, UNIQUE |
| `licenca_goias` | TEXT | Número da licença ambiental em Goiás | NOT NULL |
| `cep` | TEXT | CEP do endereço | NOT NULL |
| `endereco` | TEXT | Rua/avenida do endereço | NOT NULL |
| `bairro` | TEXT | Bairro do endereço | NOT NULL |
| `cidade` | TEXT | Cidade do endereço | NOT NULL |
| `uf` | TEXT | Unidade Federativa | NOT NULL, CHECK = 'GO' |

**Regras de Negócio:**

- ✅ Apenas empresas do estado de Goiás (UF = 'GO') podem ser cadastradas
- ✅ Deve possuir licença ambiental válida em Goiás (`licenca_goias`)
- ✅ CNPJ deve ser único no sistema (não pode haver duplicatas)
- ✅ Todos os campos são obrigatórios (NOT NULL)

**Relacionamentos:**

- **1:N** com `Certificado` (uma coletora pode ter múltiplos certificados emitidos)

---

### 3. Tabela `Solicitacao`

Armazena as solicitações de coleta de resíduos criadas pelas indústrias.

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

**Campos:**
| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INTEGER | Identificador único da solicitação | PRIMARY KEY, AUTOINCREMENT |
| `industriaId` | INTEGER | ID da indústria solicitante | NOT NULL, FOREIGN KEY → Industria(id) |
| `data` | TEXT | Data e hora da criação da solicitação (ISO 8601) | NOT NULL |
| `status` | TEXT | Status atual da solicitação | NOT NULL, CHECK IN ('Pendente', 'Aceita', 'Concluída') |
| `residuo` | TEXT | Tipo de resíduo a ser coletado | NOT NULL |
| `quantidade_kg` | REAL | Quantidade de resíduo em quilogramas | NOT NULL |

**Regras de Negócio:**

- ✅ Status deve ser obrigatoriamente um dos valores: 'Pendente', 'Aceita' ou 'Concluída'
- ✅ Workflow de status:
  - **Pendente** → Criada pela indústria, aguardando aceitação
  - **Aceita** → Aceita pela coletora, aguardando finalização
  - **Concluída** → Coleta finalizada, certificado gerado
- ✅ Quantidade deve ser um número positivo (validação no backend)
- ✅ Data é definida automaticamente no momento da criação (ISO 8601)

**Relacionamentos:**

- **N:1** com `Industria` (múltiplas solicitações pertencem a uma indústria)
- **1:1** com `Certificado` (uma solicitação concluída gera exatamente um certificado)

---

### 4. Tabela `Certificado`

Armazena os certificados de destinação final gerados automaticamente após a conclusão de uma coleta.

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

**Campos:**
| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INTEGER | Identificador único do certificado | PRIMARY KEY, AUTOINCREMENT |
| `solicitacaoId` | INTEGER | ID da solicitação que gerou o certificado | NOT NULL, UNIQUE, FOREIGN KEY → Solicitacao(id) |
| `coletoraId` | INTEGER | ID da coletora responsável pela coleta | NOT NULL, FOREIGN KEY → Coletora(id) |
| `dataEmissao` | TEXT | Data e hora de emissão do certificado (ISO 8601) | NOT NULL |
| `hashVerificacao` | TEXT | Hash SHA-256 único para verificação do certificado | NOT NULL, UNIQUE |

**Regras de Negócio:**

- ✅ Cada solicitação concluída gera **exatamente um certificado** (UNIQUE em `solicitacaoId`)
- ✅ Hash de verificação é gerado automaticamente usando SHA-256
- ✅ Hash é único no sistema (não pode haver duplicatas)
- ✅ Data de emissão é definida automaticamente no momento da criação
- ✅ Serve como comprovação legal de destinação correta do resíduo

**Relacionamentos:**

- **1:1** com `Solicitacao` (um certificado corresponde a uma solicitação)
- **N:1** com `Coletora` (múltiplos certificados podem ser emitidos por uma coletora)

---

## 🔗 Resumo dos Relacionamentos

| Tabela Origem | Tipo | Tabela Destino | Campo Foreign Key | Descrição                                      |
| ------------- | ---- | -------------- | ----------------- | ---------------------------------------------- |
| `Solicitacao` | N:1  | `Industria`    | `industriaId`     | Cada solicitação pertence a uma indústria      |
| `Certificado` | 1:1  | `Solicitacao`  | `solicitacaoId`   | Cada certificado corresponde a uma solicitação |
| `Certificado` | N:1  | `Coletora`     | `coletoraId`      | Cada certificado é emitido por uma coletora    |

---

## 🔄 Fluxo de Dados (Ciclo de Vida)

### 1. **Cadastro Inicial**

```
Industria → Cadastro no sistema
Coletora → Cadastro no sistema
```

### 2. **Criação de Solicitação**

```
Industria → Cria Solicitacao (status: 'Pendente')
```

### 3. **Aceitação da Coleta**

```
Coletora → Aceita Solicitacao (status: 'Aceita')
```

### 4. **Finalização e Certificação**

```
Coletora → Finaliza Solicitacao (status: 'Concluída')
Sistema → Gera automaticamente Certificado
```

### 5. **Visualização e Relatórios**

```
Sistema → Consulta dados relacionados via JOINs:
  - Certificado JOIN Solicitacao JOIN Industria
  - Certificado JOIN Coletora
  - Relatórios agregados (SUM, COUNT, GROUP BY)
```

---

## 📊 Consultas Complexas Utilizadas

### Exemplo 1: Buscar Certificados de uma Indústria

```sql
SELECT
    c.id,
    c.solicitacaoId,
    c.coletoraId,
    col.nome as coletoraName,
    c.dataEmissao,
    c.hashVerificacao,
    s.residuo,
    s.quantidade_kg
FROM Certificado c
INNER JOIN Solicitacao s ON c.solicitacaoId = s.id
INNER JOIN Coletora col ON c.coletoraId = col.id
WHERE s.industriaId = ?
ORDER BY c.dataEmissao DESC
```

**Relacionamentos envolvidos:**

- Certificado → Solicitacao (para obter dados da solicitação)
- Certificado → Coletora (para obter nome da coletora)
- Solicitacao → Industria (implícito via WHERE)

---

### Exemplo 2: Relatório de Resíduos por Tipo

```sql
SELECT
    s.residuo AS tipoResiduo,
    COUNT(*) AS totalColetas,
    SUM(s.quantidade_kg) AS totalKg,
    MIN(c.dataEmissao) AS primeiraEmissao,
    MAX(c.dataEmissao) AS ultimaEmissao
FROM Solicitacao s
INNER JOIN Certificado c ON c.solicitacaoId = s.id
WHERE s.status = 'Concluída'
GROUP BY s.residuo
ORDER BY totalKg DESC
```

**Agregações utilizadas:**

- `COUNT(*)` → Conta total de coletas por tipo
- `SUM()` → Soma total de quilogramas
- `MIN()` / `MAX()` → Primeira e última data de emissão
- `GROUP BY` → Agrupa por tipo de resíduo

---

### Exemplo 3: Resumo por Indústria

```sql
SELECT
    i.id AS industriaId,
    i.nome AS industriaNome,
    COUNT(s.id) AS totalColetasConcluidas,
    IFNULL(SUM(s.quantidade_kg), 0) AS totalKg
FROM Industria i
LEFT JOIN Solicitacao s ON s.industriaId = i.id AND s.status = 'Concluída'
GROUP BY i.id, i.nome
HAVING totalColetasConcluidas > 0
ORDER BY totalKg DESC
```

**Relacionamentos:**

- `LEFT JOIN` → Inclui todas as indústrias, mesmo sem coletas concluídas
- `HAVING` → Filtra apenas indústrias com coletas concluídas
- `IFNULL()` → Garante que totalKg seja 0 se não houver coletas

---

## 🔒 Constraints e Validações

### Constraints de Banco de Dados

1. **Primary Keys:**

   - Todas as tabelas possuem `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - Garantem identificação única de cada registro

2. **Foreign Keys:**

   - `Solicitacao.industriaId` → `Industria.id`
   - `Certificado.solicitacaoId` → `Solicitacao.id`
   - `Certificado.coletoraId` → `Coletora.id`
   - Garantem integridade referencial

3. **Unique Constraints:**

   - `Industria.cnpj` → CNPJ único por indústria
   - `Coletora.cnpj` → CNPJ único por coletora
   - `Certificado.solicitacaoId` → Uma solicitação = um certificado
   - `Certificado.hashVerificacao` → Hash único para verificação

4. **Check Constraints:**
   - `Industria.uf = 'GO'` → Apenas Goiás
   - `Coletora.uf = 'GO'` → Apenas Goiás
   - `Solicitacao.status IN ('Pendente', 'Aceita', 'Concluída')` → Valores válidos

### Validações no Backend

Além das constraints do banco, o backend implementa validações adicionais:

- ✅ Validação de quantidade_kg > 0 (números positivos)
- ✅ Validação de status antes de transições (Pendente → Aceita → Concluída)
- ✅ Validação de CNPJ duplicado (tratamento de erro UNIQUE)
- ✅ Validação de datas nos relatórios
- ✅ Geração de hash único com timestamp para evitar colisões

---

## 📈 Índices Implícitos

O SQLite cria automaticamente índices para:

- ✅ Primary Keys (id)
- ✅ Foreign Keys (melhora performance de JOINs)
- ✅ Campos UNIQUE (cnpj, hashVerificacao, solicitacaoId)

---

## 🎯 Considerações de Design

### Escolhas de Design

1. **TEXT para datas (ISO 8601):**

   - Facilita manipulação em JavaScript
   - Formato padrão: `YYYY-MM-DDTHH:mm:ss.sssZ`

2. **REAL para quantidade_kg:**

   - Permite valores decimais (ex: 500.5 kg)
   - Adequado para medições precisas

3. **Status como ENUM via CHECK:**

   - Restringe valores válidos no banco
   - Facilita consultas por status

4. **Hash SHA-256 único:**

   - Garante verificação de autenticidade do certificado
   - Evita fraudes e alterações

5. **1:1 entre Solicitacao e Certificado:**
   - Garante rastreabilidade completa
   - Uma coleta = um certificado

### Normalização

O banco está na **3ª Forma Normal (3NF):**

- ✅ Sem redundância de dados
- ✅ Cada informação é armazenada uma única vez
- ✅ Dados relacionados são acessados via JOINs

---

## 🛠️ Arquivo de Banco de Dados

- **Localização:** `backend/database.db`
- **Tipo:** SQLite (arquivo único)
- **Inicialização:** Automática na primeira execução do servidor
- **Migrations:** Não utilizadas (CREATE TABLE IF NOT EXISTS)

---

## 📝 Observações Importantes

1. **Integridade Referencial:**

   - SQLite não força integridade referencial por padrão
   - O código do backend garante que foreign keys sejam válidas
   - Constraints UNIQUE evitam duplicações

2. **Backup:**

   - O arquivo `database.db` pode ser copiado diretamente
   - SQLite não requer servidor separado

3. **Escalabilidade:**

   - Adequado para volumes médios de dados
   - Para grandes volumes, considerar migração para PostgreSQL/MySQL

4. **Segurança:**
   - Hash SHA-256 garante autenticidade dos certificados
   - Validações no backend previnem inserções inválidas

---

**Documento criado para:** Sistema de Coleta Seletiva Industrial - APS  
**Última atualização:** Incluindo estrutura de relatórios e relacionamentos complexos
