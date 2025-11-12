/**
 * Controller de Coletoras
 * Processa requisições HTTP relacionadas a empresas coletoras
 */

const coletorasService = require('../services/coletorasService');

/**
 * Cria uma nova coletora
 * Endpoint: POST /coletoras
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com os dados da coletora criada (201) ou erro (400/409/500)
 */
async function criarColetora(req, res) {
    try {
        const { nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf } = req.body;

        // Validação: verificar se todos os campos obrigatórios foram fornecidos
        if (!nome || !cnpj || !licenca_goias || !cep || !endereco || !bairro || !cidade || !uf) {
            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios: nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf'
            });
        }

        // Validação: verificar se a UF é "GO" (apenas empresas de Goiás)
        if (uf !== 'GO') {
            return res.status(400).json({
                erro: 'Apenas empresas de Goiás (UF = GO) podem ser cadastradas'
            });
        }

        // Chamar service para criar coletora no banco de dados
        const coletora = await coletorasService.criar(req.body);

        // Retornar sucesso com status 201 (Created)
        res.status(201).json(coletora);

    } catch (erro) {
        // Tratamento de erro: CNPJ duplicado
        if (erro.message && erro.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
                erro: 'CNPJ já cadastrado no sistema'
            });
        }

        // Tratamento de erro genérico
        console.error('Erro ao criar coletora:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao criar coletora'
        });
    }
}

/**
 * Lista todas as coletoras licenciadas em Goiás
 * Endpoint: GET /coletoras-goias
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Object} JSON com array de coletoras de Goiás (200) ou erro (500)
 */
async function listarColetorasGoias(req, res) {
    try {
        // Chamar service para buscar coletoras de Goiás
        const coletoras = await coletorasService.listarGoias();

        // Retornar sucesso com status 200 (OK)
        res.status(200).json(coletoras);

    } catch (erro) {
        // Tratamento de erro genérico
        console.error('Erro ao listar coletoras:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor ao listar coletoras'
        });
    }
}

// Exportar funções do controller
module.exports = {
    criarColetora,
    listarColetorasGoias
};
