/**
 * Rotas de Coletoras
 * Define os endpoints HTTP para operações relacionadas a empresas coletoras
 */

const express = require('express');
const router = express.Router();
const coletorasController = require('../controllers/coletorasController');

/**
 * POST /coletoras
 * Endpoint para cadastrar uma nova coletora
 * Body: { nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf }
 * Response: 201 - Coletora criada com sucesso
 *           400 - Dados inválidos ou faltando
 *           409 - CNPJ já cadastrado
 *           500 - Erro interno do servidor
 */
router.post('/', coletorasController.criarColetora);

/**
 * GET /coletoras/goias
 * Endpoint para listar todas as coletoras licenciadas em Goiás
 * Response: 200 - Array de coletoras de Goiás
 *           500 - Erro interno do servidor
 */
router.get('/goias', coletorasController.listarColetorasGoias);

// Exportar router
module.exports = router;
