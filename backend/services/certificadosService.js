/**
 * Service de Certificados
 * Contém toda a lógica de negócio relacionada aos certificados de destinação final
 */

const db = require('../database');
const { gerarHashCertificado } = require('../utils/hashGenerator');

/**
 * Cria um novo certificado de destinação final
 * Gera automaticamente um hash único de verificação e define a data de emissão
 * @param {Object} dados - Dados do certificado (solicitacaoId, coletoraId)
 * @returns {Promise<Object>} Certificado criado
 */
function criar(dados) {
    return new Promise((resolve, reject) => {
        const { solicitacaoId, coletoraId } = dados;

        // Define data de emissão como data/hora atual
        const dataEmissao = new Date().toISOString();

        // Gera hash único de verificação usando o utilitário hashGenerator
        const hashVerificacao = gerarHashCertificado(solicitacaoId, coletoraId, dataEmissao);

        const sql = `
            INSERT INTO Certificado (solicitacaoId, coletoraId, dataEmissao, hashVerificacao)
            VALUES (?, ?, ?, ?)
        `;

        db.run(sql, [solicitacaoId, coletoraId, dataEmissao, hashVerificacao], function (err) {
            if (err) {
                // Tratamento específico para violação de constraint UNIQUE em solicitacaoId
                if (err.message && err.message.includes('UNIQUE constraint failed')) {
                    reject(new Error('Já existe um certificado para esta solicitação'));
                } else {
                    reject(err);
                }
            } else {
                // Retorna o certificado criado com o ID gerado
                resolve({
                    id: this.lastID,
                    solicitacaoId,
                    coletoraId,
                    dataEmissao,
                    hashVerificacao
                });
            }
        });
    });
}

/**
 * Busca todos os certificados de uma indústria específica
 * Inclui dados da coletora e detalhes da solicitação através de JOINs
 * Retorna certificados ordenados por data de emissão (mais recente primeiro)
 * @param {number} industriaId - ID da indústria
 * @returns {Promise<Array>} Lista de certificados com dados completos
 */
function buscarPorIndustria(industriaId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                c.id,
                c.solicitacaoId,
                c.coletoraId,
                col.nome as coletoraName,
                c.dataEmissao,
                c.hashVerificacao,
                s.residuo,
                s.quantidade_kg
            FROM Certificado c
            INNER JOIN Solicitacao s ON c.solicitacaoId = s.id
            INNER JOIN Coletora col ON c.coletoraId = col.id
            WHERE s.industriaId = ?
            ORDER BY c.dataEmissao DESC
        `;

        db.all(sql, [industriaId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Exporta todas as funções do service
module.exports = {
    criar,
    buscarPorIndustria
};
