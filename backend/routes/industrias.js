/**
 * Rotas de Indústrias
 * Define os endpoints HTTP para operações relacionadas a indústrias
 */

const express = require('express');
const router = express.Router();
const industriasController = require('../controllers/industriasController');

/**
 * POST /industrias
 * Endpoint para cadastrar uma nova indústria
 * Body: { nome, cnpj, cep, endereco, bairro, cidade, uf }
 * Response: 201 - Indústria criada com sucesso
 *           400 - Dados inválidos ou faltando
 *           409 - CNPJ já cadastrado
 *           500 - Erro interno do servidor
 */
router.post('/', industriasController.criarIndustria);

/**
 * GET /industrias
 * Endpoint para listar todas as indústrias cadastradas
 * Response: 200 - Array de indústrias
 *           500 - Erro interno do servidor
 */
router.get('/', industriasController.listarIndustrias);

// Exportar router
module.exports = router;
