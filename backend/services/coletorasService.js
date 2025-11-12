/**
 * Service de Coletoras
 * Contém a lógica de negócio para operações relacionadas a empresas coletoras
 */

const db = require('../database');

/**
 * Cria uma nova coletora no banco de dados
 * @param {Object} dados - Dados da coletora (nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf)
 * @returns {Promise<Object>} Dados da coletora criada incluindo o ID gerado
 * @throws {Error} Erro de banco de dados (ex: CNPJ duplicado)
 */
function criar(dados) {
    return new Promise((resolve, reject) => {
        const { nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf } = dados;

        // Query SQL para inserir nova coletora
        const sql = `
            INSERT INTO Coletora (nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Executar inserção no banco de dados
        db.run(sql, [nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf], function (erro) {
            if (erro) {
                // Rejeitar promise em caso de erro (ex: CNPJ duplicado)
                return reject(erro);
            }

            // Retornar dados da coletora criada com o ID gerado
            resolve({
                id: this.lastID,
                nome,
                cnpj,
                licenca_goias,
                cep,
                endereco,
                bairro,
                cidade,
                uf
            });
        });
    });
}

/**
 * Lista todas as coletoras licenciadas em Goiás (UF = "GO")
 * @returns {Promise<Array>} Array com todas as coletoras de Goiás
 * @throws {Error} Erro de banco de dados
 */
function listarGoias() {
    return new Promise((resolve, reject) => {
        // Query SQL para buscar coletoras apenas de Goiás
        const sql = 'SELECT * FROM Coletora WHERE uf = ? ORDER BY nome';

        // Executar consulta no banco de dados filtrando por UF = "GO"
        db.all(sql, ['GO'], (erro, linhas) => {
            if (erro) {
                // Rejeitar promise em caso de erro
                return reject(erro);
            }

            // Retornar array de coletoras de Goiás
            resolve(linhas);
        });
    });
}

// Exportar funções do service
module.exports = {
    criar,
    listarGoias
};
