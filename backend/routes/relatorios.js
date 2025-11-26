/**
 * Rotas de Relatórios
 * Define endpoints para relatórios gerenciais e ambientais.
 */

const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

// Visão geral do sistema
router.get('/visao-geral', relatoriosController.obterVisaoGeral);

// Resíduos agregados por tipo, com filtros opcionais de data
router.get('/residuos', relatoriosController.residuosPorTipo);

// Resumo agregado por indústria
router.get('/industria', relatoriosController.resumoPorIndustria);

module.exports = router;


