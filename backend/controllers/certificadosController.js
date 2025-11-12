/**
 * Controller de Certificados
 * Processa requisições HTTP relacionadas a certificados de destinação final
 */

const certificadosService = require('../services/certificadosService');

/**
 * Lista todos os certificados de uma indústria específica
 * Endpoint: GET /certificados/industria/:id
 * Retorna certificados com dados completos incluindo hashVerificacao, dados da coletora e detalhes da solicitação
 * @param {Object} req - Objeto de requisição do Express (ID via parâmetro de rota)
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de certificados (200) ou erro (400/500)
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

        // Chamar service para buscar certificados da indústria
        // O service já retorna os dados formatados com informações da coletora e solicitação
        const certificados = await certificadosService.buscarPorIndustria(industriaId);

        // Retornar sucesso com status 200 (OK)
        // A resposta já inclui: id, solicitacaoId, coletoraId, coletoraName, 
        // dataEmissao, hashVerificacao, residuo, quantidade_kg
        res.status(200).json(certificados);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar certificados por indústria:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar certificados'
        });
    }
}

// Exportar funções do controller
module.exports = {
    listarPorIndustria
};
