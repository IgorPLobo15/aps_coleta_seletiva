/**
 * Controller de Indústrias
 * Processa requisições HTTP relacionadas a indústrias
 */

const industriasService = require('../services/industriasService');

/**
 * Cria uma nova indústria
 * Endpoint: POST /industrias
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com os dados da indústria criada (201) ou erro (400/409/500)
 */
async function criarIndustria(req, res) {
    try {
        const { nome, cnpj, cep, endereco, bairro, cidade, uf } = req.body;

        // Validação: verificar se todos os campos obrigatórios foram fornecidos
        if (!nome || !cnpj || !cep || !endereco || !bairro || !cidade || !uf) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios: nome, cnpj, cep, endereco, bairro, cidade, uf'
            });
        }

        // Validação: verificar se a UF é "GO" (apenas empresas de Goiás)
        if (uf !== 'GO') {
            return res.status(400).json({
                erro: 'Apenas empresas de Goiás (UF = GO) podem ser cadastradas'
            });
        }

        // Chamar service para criar indústria no banco de dados
        const industria = await industriasService.criar(req.body);

        // Retornar sucesso com status 201 (Created)
        res.status(201).json(industria);

    } catch (erro) {
        // Tratamento de erro: CNPJ duplicado
        if (erro.message && erro.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
                erro: 'CNPJ já cadastrado no sistema'
            });
        }

        // Tratamento de erro genérico
        console.error('Erro ao criar indústria:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao criar indústria'
        });
    }
}

/**
 * Lista todas as indústrias cadastradas
 * Endpoint: GET /industrias
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de indústrias (200) ou erro (500)
 */
async function listarIndustrias(req, res) {
    try {
        // Chamar service para buscar todas as indústrias
        const industrias = await industriasService.listarTodas();

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(industrias);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar indústrias:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar indústrias'
        });
    }
}

// Exportar funções do controller
module.exports = {
    criarIndustria,
    listarIndustrias
};
