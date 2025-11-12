/**
 * Sistema de Gerenciamento de Coleta Seletiva Industrial
 * Arquivo principal do servidor Express
 * 
 * Este arquivo é o ponto de entrada da aplicação backend.
 * Configura o servidor Express, middlewares, rotas e inicializa o banco de dados.
 */

const express = require('express');
const cors = require('cors');

// Criar instância do Express
const app = express();

// Configurar porta do servidor
const PORT = process.env.PORT || 3000;

/**
 * Configuração de Middlewares
 */

// CORS - Permitir requisições do frontend
app.use(cors({
    origin: '*', // Em produção, especificar o domínio do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware para parsing de JSON
app.use(express.json());

// Middleware para parsing de URL-encoded data
app.use(express.urlencoded({ extended: true }));

/**
 * Rotas da API
 * As rotas serão registradas aqui conforme forem implementadas
 */

// Importar rotas
const industriasRoutes = require('./routes/industrias');
const coletorasRoutes = require('./routes/coletoras');
const solicitacoesRoutes = require('./routes/solicitacoes');
const certificadosRoutes = require('./routes/certificados');

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema de Coleta Seletiva Industrial está funcionando!',
        versao: '1.0.0'
    });
});

// Registrar rotas de indústrias
app.use('/industrias', industriasRoutes);

// Registrar rotas de coletoras
app.use('/coletoras', coletorasRoutes);

// Registrar rotas de solicitações
app.use('/solicitacoes', solicitacoesRoutes);

// Registrar rotas de certificados
app.use('/certificados', certificadosRoutes);

/**
 * Inicialização do Servidor
 */
app.listen(PORT, () => {
    console.log('===========================================');
    console.log('Sistema de Coleta Seletiva Industrial - API');
    console.log('===========================================');
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log('===========================================');
});

/**
 * Tratamento de erros não capturados
 */
process.on('unhandledRejection', (erro) => {
    console.error('Erro não tratado:', erro);
});

module.exports = app;
