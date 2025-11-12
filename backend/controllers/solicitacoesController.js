/**
 * Controller de Solicitações
 * Processa requisições HTTP relacionadas a solicitações de coleta
 */

const solicitacoesService = require('../services/solicitacoesService');
const certificadosService = require('../services/certificadosService');

/**
 * Cria uma nova solicitação de coleta
 * Endpoint: POST /solicitacoes
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com os dados da solicitação criada (201) ou erro (400/500)
 */
async function criarSolicitacao(req, res) {
    try {
        const { industriaId, residuo, quantidade_kg } = req.body;

        // Validação: verificar se todos os campos obrigatórios foram fornecidos
        if (!industriaId || !residuo || !quantidade_kg) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios: industriaId, residuo, quantidade_kg'
            });
        }

        // Validação: verificar se quantidade_kg é um número positivo
        if (typeof quantidade_kg !== 'number' || quantidade_kg <= 0) {
            return res.status(400).json({
                erro: 'A quantidade_kg deve ser um número positivo'
            });
        }

        // Chamar service para criar solicitação no banco de dados
        const solicitacao = await solicitacoesService.criar(req.body);

        // Retornar sucesso com status 201 (Created)
        res.status(201).json(solicitacao);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao criar solicitação:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao criar solicitação'
        });
    }
}

/**
 * Lista todas as solicitações de uma indústria específica
 * Endpoint: GET /solicitacoes/industria/:id
 * @param {Object} req - Objeto de requisição do Express (ID via parâmetro de rota)
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de solicitações (200) ou erro (500)
 */
async function listarPorIndustria(req, res) {
    try {
        const industriaId = parseInt(req.params.id);

        // Validação: verificar se o ID é um número válido
        if (isNaN(industriaId)) {
            return res.status(400).json({
                erro: 'ID da indústria inválido'
            });
        }

        // Chamar service para buscar solicitações da indústria
        const solicitacoes = await solicitacoesService.buscarPorIndustria(industriaId);

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(solicitacoes);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar solicitações por indústria:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar solicitações'
        });
    }
}

/**
 * Lista todas as solicitações com status "Pendente"
 * Endpoint: GET /solicitacoes/pendentes
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de solicitações pendentes (200) ou erro (500)
 */
async function listarPendentes(req, res) {
    try {
        // Chamar service para buscar solicitações pendentes
        const solicitacoes = await solicitacoesService.buscarPendentes();

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(solicitacoes);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar solicitações pendentes:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar solicitações pendentes'
        });
    }
}

/**
 * Lista todas as solicitações com status "Aceita"
 * Endpoint: GET /solicitacoes/aceitas
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de solicitações aceitas (200) ou erro (500)
 */
async function listarAceitas(req, res) {
    try {
        // Chamar service para buscar solicitações aceitas
        const solicitacoes = await solicitacoesService.buscarAceitas();

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(solicitacoes);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar solicitações aceitas:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar solicitações aceitas'
        });
    }
}

/**
 * Aceita uma solicitação pendente
 * Endpoint: PUT /solicitacoes/:id/aceitar
 * @param {Object} req - Objeto de requisição do Express (ID via parâmetro de rota)
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com a solicitação atualizada (200) ou erro (400/404/500)
 */
async function aceitarSolicitacao(req, res) {
    try {
        const id = parseInt(req.params.id);

        // Validação: verificar se o ID é um número válido
        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID da solicitação inválido'
            });
        }

        // Chamar service para aceitar a solicitação
        // O service já valida se o status atual é "Pendente"
        const solicitacao = await solicitacoesService.aceitar(id);

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(solicitacao);

    } catch (erro) {
        // Tratamento de erro: solicitação não encontrada
        if (erro.message && erro.message.includes('não encontrada')) {
            return res.status(404).json({
                erro: erro.message
            });
        }

        // Tratamento de erro: status inválido
        if (erro.message && erro.message.includes('Não é possível aceitar')) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        // Tratamento de erro genérico
        console.error('Erro ao aceitar solicitação:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao aceitar solicitação'
        });
    }
}

/**
 * Conclui uma solicitação aceita e gera certificado
 * Endpoint: POST /solicitacoes/:id/concluir
 * @param {Object} req - Objeto de requisição do Express (ID via parâmetro de rota, coletoraId no body)
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com a solicitação e certificado (200) ou erro (400/404/500)
 */
async function concluirSolicitacao(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { coletoraId } = req.body;

        // Validação: verificar se o ID é um número válido
        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID da solicitação inválido'
            });
        }

        // Validação: verificar se coletoraId foi fornecido
        if (!coletoraId) {
            return res.status(400).json({
                erro: 'O campo coletoraId é obrigatório'
            });
        }

        // Chamar service para concluir a solicitação
        // O service já valida se o status atual é "Aceita"
        const solicitacao = await solicitacoesService.concluir(id);

        // Chamar service de certificados para gerar o certificado
        const certificado = await certificadosService.criar({
            solicitacaoId: id,
            coletoraId: coletoraId
        });

        // Retornar sucesso com status 200 (OK) incluindo solicitação e certificado
        res.status(200).json({
            solicitacao,
            certificado
        });

    } catch (erro) {
        // Tratamento de erro: solicitação não encontrada
        if (erro.message && erro.message.includes('não encontrada')) {
            return res.status(404).json({
                erro: erro.message
            });
        }

        // Tratamento de erro: status inválido
        if (erro.message && erro.message.includes('Não é possível concluir')) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        // Tratamento de erro genérico
        console.error('Erro ao concluir solicitação:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao concluir solicitação'
        });
    }
}

// Exportar funções do controller
module.exports = {
    criarSolicitacao,
    listarPorIndustria,
    listarPendentes,
    listarAceitas,
    aceitarSolicitacao,
    concluirSolicitacao
};
