# 🌱 Script de Seed - População do Banco de Dados

## 📋 Descrição

O script `seed.js` popula o banco de dados com dados de exemplo para testes e demonstração do sistema. Ele cria:

- **10 indústrias** com dados realistas de Goiás
- **5 coletoras** licenciadas
- **~50 solicitações** com diferentes status:
  - 15 pendentes (30%)
  - 10 aceitas (20%)
  - 25 concluídas (50%)
- **~25 certificados** gerados para as solicitações concluídas

## 🚀 Como Usar

### Método 1: Usando npm script (Recomendado)

```bash
cd backend
npm run seed
```

### Método 2: Executar diretamente

```bash
cd backend
node seed.js
```

## ⚠️ Importante

**ATENÇÃO:** Este script irá **LIMPAR TODOS os dados existentes** no banco de dados antes de inserir os novos dados. Certifique-se de fazer backup se necessário.

## 📊 Dados Gerados

### Indústrias

- 10 empresas de diferentes setores (metalúrgica, química, plásticos, etc.)
- Localizadas em diferentes cidades de Goiás (Goiânia, Anápolis, Aparecida de Goiânia, etc.)
- CNPJs únicos e endereços variados

### Coletoras

- 5 empresas coletoras licenciadas
- Cada uma com licença única do estado de Goiás
- Distribuídas em diferentes cidades

### Solicitações

- Distribuídas aleatoriamente entre as indústrias
- 15 tipos diferentes de resíduos:

  - Plástico Industrial
  - Metal Ferroso / Não-Ferroso
  - Papel e Papelão
  - Resíduo Químico
  - Óleo Usado
  - Lixo Eletrônico
  - Tecido Industrial
  - Vidro Industrial
  - Borracha Industrial
  - Madeira Processada
  - Resíduo Orgânico Industrial
  - Sucata Metálica
  - Embalagens Plásticas
  - Resíduo de Construção Civil

- Quantidades variam entre 50kg e 2000kg
- Datas distribuídas nos últimos 90 dias

### Certificados

- Gerados automaticamente para todas as solicitações concluídas
- Hash SHA-256 único para cada certificado
- Datas de emissão variadas

## 🎯 Casos de Uso

Este script é útil para:

1. **Testes do Sistema**: Popular o banco para testar todas as funcionalidades
2. **Demonstração**: Apresentar o sistema com dados realistas
3. **Desenvolvimento**: Ter dados para trabalhar durante o desenvolvimento
4. **Relatórios**: Testar os relatórios com volume de dados significativo

## 🔄 Repopular o Banco

Para repopular o banco com novos dados, basta executar o script novamente. Ele limpará automaticamente os dados anteriores.

## 📝 Personalização

Se desejar modificar os dados, edite o arquivo `seed.js`:

- Alterar quantidade de indústrias/coletoras: modifique os arrays `industrias` e `coletoras`
- Alterar quantidade de solicitações: modifique a variável `totalSolicitacoes`
- Alterar distribuição de status: modifique a lógica de atribuição de status
- Adicionar novos tipos de resíduos: adicione no array `tiposResiduos`

## 🐛 Troubleshooting

### Erro: "Cannot find module 'database'"

Certifique-se de estar na pasta `backend` ao executar o script.

### Erro: "UNIQUE constraint failed"

O script já trata isso, mas se ocorrer, significa que há duplicação de CNPJ ou hash. Execute novamente o script.

### Tabelas não criadas

Certifique-se de que o arquivo `database.js` está correto e que as tabelas foram inicializadas. O script aguarda 1 segundo para garantir a criação das tabelas.

## ✅ Verificação

Após executar o script, você pode verificar os dados:

1. **Via Frontend**: Acesse as páginas do sistema e visualize os dados
2. **Via API**: Faça requisições GET para verificar os dados
3. **Via SQLite**: Use um cliente SQLite para verificar diretamente o banco

```bash
# Exemplo: Listar todas as indústrias
curl http://localhost:3000/industrias

# Exemplo: Ver relatório geral
curl http://localhost:3000/relatorios/visao-geral
```

---

**Criado para:** Sistema de Coleta Seletiva Industrial - APS
