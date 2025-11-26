/**
 * Controller de Relatórios
 * Exponde endpoints para relatórios gerenciais e ambientais.
 */

const relatoriosService = require('../services/relatoriosService');

/**
 * GET /relatorios/visao-geral
 * Retorna indicadores gerais do sistema.
 */
async function obterVisaoGeral(req, res) {
    try {
        const dados = await relatoriosService.obterVisaoGeral();
        return res.status(200).json(dados);
    } catch (erro) {
        console.error('Erro ao obter visão geral de relatórios:', erro);
        return res.status(500).json({
            erro: 'Erro interno do servidor ao obter visão geral de relatórios'
        });
    }
}

/**
 * GET /relatorios/residuos
 * Relatório de resíduos agregados por tipo.
 * Query params opcionais:
 *  - dataInicio (YYYY-MM-DD)
 *  - dataFim (YYYY-MM-DD)
 */
async function residuosPorTipo(req, res) {
    try {
        const { dataInicio, dataFim } = req.query;

        // Validação simples de formato (YYYY-MM-DD)
        const regexData = /^\d{4}-\d{2}-\d{2}$/;
        if (dataInicio && !regexData.test(dataInicio)) {
            return res.status(400).json({
                erro: 'dataInicio inválida. Utilize o formato YYYY-MM-DD.'
            });
        }
        if (dataFim && !regexData.test(dataFim)) {
            return res.status(400).json({
                erro: 'dataFim inválida. Utilize o formato YYYY-MM-DD.'
            });
        }

        const dados = await relatoriosService.residuosPorTipo({ dataInicio, dataFim });
        return res.status(200).json(dados);
    } catch (erro) {
        console.error('Erro ao obter relatório de resíduos por tipo:', erro);
        return res.status(500).json({
            erro: 'Erro interno do servidor ao obter relatório de resíduos por tipo'
        });
    }
}

/**
 * GET /relatorios/industria
 * Relatório agregado por indústria.
 */
async function resumoPorIndustria(req, res) {
    try {
        const dados = await relatoriosService.resumoPorIndustria();
        return res.status(200).json(dados);
    } catch (erro) {
        console.error('Erro ao obter resumo de relatórios por indústria:', erro);
        return res.status(500).json({
            erro: 'Erro interno do servidor ao obter resumo por indústria'
        });
    }
}

module.exports = {
    obterVisaoGeral,
    residuosPorTipo,
    resumoPorIndustria
};


