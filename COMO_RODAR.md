# 🚀 Como Rodar o Sistema de Coleta Seletiva Industrial

## ✅ Status Atual

- ✅ **Banco de dados populado** com dados de exemplo:
  - 10 indústrias
  - 5 coletoras
  - 50 solicitações
  - 25 certificados

## 📋 Passo a Passo para Rodar o Projeto

### 1️⃣ Iniciar o Backend

Abra um terminal e execute:

```bash
cd backend
npm run dev
```

O servidor backend iniciará na porta **3000** e você verá:

```
Servidor rodando na porta 3000
Acesse: http://localhost:3000
```

**Mantenha este terminal aberto** - o servidor precisa estar rodando!

### 2️⃣ Abrir o Frontend

Você tem **duas opções**:

#### Opção A: Abrir diretamente no navegador (Mais Simples)

1. Navegue até a pasta `frontend`
2. Abra o arquivo `index.html` com seu navegador (duplo clique)
3. Ou arraste o arquivo `index.html` para o navegador

#### Opção B: Usar um servidor HTTP local (Recomendado)

Se você tem Python instalado:

```bash
cd frontend
python -m http.server 8080
```

Depois acesse: `http://localhost:8080`

Ou se tiver Node.js, pode usar `http-server`:

```bash
npx http-server frontend -p 8080
```

## 🌐 URLs de Acesso

- **Backend API**: http://localhost:3000
- **Frontend**:
  - Arquivo direto: `file:///caminho/para/frontend/index.html`
  - Ou servidor local: http://localhost:8080

## 📱 Páginas Disponíveis

1. **index.html** - Página inicial com navegação
2. **cadastro.html** - Cadastro de indústrias e coletoras
3. **industria.html** - Dashboard da indústria
4. **coletora.html** - Dashboard da coletora
5. **relatorios.html** - Página de relatórios (NOVO!)

## 🧪 Testar a API

Você pode testar se o backend está funcionando:

```bash
curl http://localhost:3000
```

Deve retornar:

```json
{
  "mensagem": "API do Sistema de Coleta Seletiva Industrial está funcionando!",
  "versao": "1.0.0"
}
```

## 📊 Verificar Dados Populados

### Via API:

```bash
# Ver todas as indústrias
curl http://localhost:3000/industrias

# Ver relatório geral
curl http://localhost:3000/relatorios/visao-geral

# Ver solicitações pendentes
curl http://localhost:3000/solicitacoes/pendentes
```

### Via Frontend:

1. Abra `index.html`
2. Acesse "Relatórios" para ver estatísticas
3. Acesse "Indústria" para ver solicitações e certificados
4. Acesse "Coletora" para ver coletas pendentes/aceitas

## 🔄 Repopular o Banco (Se Necessário)

Se quiser repopular o banco com novos dados:

```bash
cd backend
npm run seed
```

**ATENÇÃO:** Isso apagará todos os dados existentes!

## 🐛 Troubleshooting

### Backend não inicia

1. Verifique se a porta 3000 está livre
2. Certifique-se de estar na pasta `backend`
3. Instale dependências: `npm install`

### Frontend não conecta ao backend

1. Verifique se o backend está rodando em http://localhost:3000
2. Abra o console do navegador (F12) para ver erros
3. Verifique se não há bloqueio de CORS (o backend já está configurado)

### Erro ao abrir arquivo HTML

- Use um servidor HTTP local (Opção B acima)
- Ou verifique se o caminho do arquivo está correto

## 📝 Notas Importantes

- O backend precisa estar rodando para o frontend funcionar
- O banco de dados (`database.db`) é criado automaticamente
- Dados são persistidos mesmo após reiniciar o servidor
- Use `npm run dev` para desenvolvimento (auto-reload)
- Use `npm start` para produção

---

**Sistema pronto para uso! 🎉**
