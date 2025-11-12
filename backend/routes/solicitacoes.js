/**
 * Rotas de Solicitações
 * Define os endpoints HTTP para operações relacionadas a solicitações de coleta
 */

const express = require('express');
const router = express.Router();
const solicitacoesController = require('../controllers/solicitacoesController');

/**
 * POST /solicitacoes
 * Endpoint para criar uma nova solicitação de coleta
 * Body: { industriaId, residuo, quantidade_kg }
 * Response: 201 - Solicitação criada com sucesso
 *           400 - Dados inválidos ou faltando
 *           500 - Erro interno do servidor
 */
router.post('/', solicitacoesController.criarSolicitacao);

/**
 * GET /solicitacoes/industria/:id
 * Endpoint para listar todas as solicitações de uma indústria específica
 * Params: id - ID da indústria
 * Response: 200 - Array de solicitações da indústria
 *           400 - ID inválido
 *           500 - Erro interno do servidor
 */
router.get('/industria/:id', solicitacoesController.listarPorIndustria);

/**
 * GET /solicitacoes/pendentes
 * Endpoint para listar todas as solicitações com status "Pendente"
 * Response: 200 - Array de solicitações pendentes
 *           500 - Erro interno do servidor
 */
router.get('/pendentes', solicitacoesController.listarPendentes);

/**
 * GET /solicitacoes/aceitas
 * Endpoint para listar todas as solicitações com status "Aceita"
 * Response: 200 - Array de solicitações aceitas
 *           500 - Erro interno do servidor
 */
router.get('/aceitas', solicitacoesController.listarAceitas);

/**
 * PUT /solicitacoes/:id/aceitar
 * Endpoint para aceitar uma solicitação pendente
 * Params: id - ID da solicitação
 * Response: 200 - Solicitação aceita com sucesso
 *           400 - ID inválido ou status não é "Pendente"
 *           404 - Solicitação não encontrada
 *           500 - Erro interno do servidor
 */
router.put('/:id/aceitar', solicitacoesController.aceitarSolicitacao);

/**
 * POST /solicitacoes/:id/concluir
 * Endpoint para concluir uma solicitação aceita e gerar certificado
 * Params: id - ID da solicitação
 * Body: { coletoraId }
 * Response: 200 - Solicitação concluída e certificado gerado
 *           400 - ID inválido, coletoraId faltando ou status não é "Aceita"
 *           404 - Solicitação não encontrada
 *           500 - Erro interno do servidor
 */
router.post('/:id/concluir', solicitacoesController.concluirSolicitacao);

// Exportar router
module.exports = router;
