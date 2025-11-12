/**
 * Rotas de Certificados
 * Define os endpoints HTTP para operações relacionadas a certificados de destinação final
 */

const express = require('express');
const router = express.Router();
const certificadosController = require('../controllers/certificadosController');

/**
 * GET /certificados/industria/:id
 * Lista todos os certificados de uma indústria específica
 * Retorna certificados com dados completos incluindo hash de verificação, coletora e solicitação
 */
router.get('/industria/:id', certificadosController.listarPorIndustria);

// Exportar o router
module.exports = router;
