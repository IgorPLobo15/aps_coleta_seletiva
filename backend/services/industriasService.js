/**
 * Service de Indústrias
 * Contém a lógica de negócio para operações relacionadas a indústrias
 */

const db = require('../database');

/**
 * Cria uma nova indústria no banco de dados
 * @param {Object} dados - Dados da indústria (nome, cnpj, cep, endereco, bairro, cidade, uf)
 * @returns {Promise<Object>} Dados da indústria criada incluindo o ID gerado
 * @throws {Error} Erro de banco de dados (ex: CNPJ duplicado)
 */
function criar(dados) {
    return new Promise((resolve, reject) => {
        const { nome, cnpj, cep, endereco, bairro, cidade, uf } = dados;

        // Query SQL para inserir nova indústria
        const sql = `
            INSERT INTO Industria (nome, cnpj, cep, endereco, bairro, cidade, uf)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        // Executar inserção no banco de dados
        db.run(sql, [nome, cnpj, cep, endereco, bairro, cidade, uf], function (erro) {
            if (erro) {
                // Rejeitar promise em caso de erro (ex: CNPJ duplicado)
                return reject(erro);
            }

            // Retornar dados da indústria criada com o ID gerado
            resolve({
                id: this.lastID,
                nome,
                cnpj,
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
 * Lista todas as indústrias cadastradas no banco de dados
 * @returns {Promise<Array>} Array com todas as indústrias
 * @throws {Error} Erro de banco de dados
 */
function listarTodas() {
    return new Promise((resolve, reject) => {
        // Query SQL para buscar todas as indústrias
        const sql = 'SELECT * FROM Industria ORDER BY nome';

        // Executar consulta no banco de dados
        db.all(sql, [], (erro, linhas) => {
            if (erro) {
                // Rejeitar promise em caso de erro
                return reject(erro);
            }

            // Retornar array de indústrias
            resolve(linhas);
        });
    });
}

// Exportar funções do service
module.exports = {
    criar,
    listarTodas
};
