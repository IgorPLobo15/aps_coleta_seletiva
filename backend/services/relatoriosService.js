/**
 * Service de Relatórios
 * Centraliza consultas agregadas para apoiar a gestão ambiental e a análise de dados.
 *
 * Todos os relatórios consideram apenas coletas CONCLUÍDAS,
 * ou seja, solicitações com status "Concluída" que possuem certificado.
 */

const db = require('../database');

/**
 * Retorna visão geral do sistema:
 * - total de indústrias
 * - total de coletoras
 * - total de solicitações
 * - total de coletas concluídas
 * - total de resíduos coletados (kg) em coletas concluídas
 *
 * @returns {Promise<Object>}
 */
function obterVisaoGeral() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM Industria) AS totalIndustrias,
                (SELECT COUNT(*) FROM Coletora) AS totalColetoras,
                (SELECT COUNT(*) FROM Solicitacao) AS totalSolicitacoes,
                (SELECT COUNT(*) FROM Solicitacao WHERE status = 'Concluída') AS totalColetasConcluidas,
                IFNULL((
                    SELECT SUM(s.quantidade_kg)
                    FROM Solicitacao s
                    INNER JOIN Certificado c ON c.solicitacaoId = s.id
                    WHERE s.status = 'Concluída'
                ), 0) AS totalKgColetado
        `;

        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Retorna relatório de resíduos agregados por tipo de resíduo.
 *
 * Pode receber data de início e fim (opcionais) para filtrar pela data de emissão
 * do certificado (dataEmissao).
 *
 * @param {Object} filtros
 * @param {string} [filtros.dataInicio] - Data inicial (YYYY-MM-DD)
 * @param {string} [filtros.dataFim] - Data final (YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
function residuosPorTipo({ dataInicio, dataFim } = {}) {
    return new Promise((resolve, reject) => {
        const params = [];
        let where = `
            WHERE s.status = 'Concluída'
        `;

        // Filtrar por intervalo de datas usando dataEmissao do certificado
        if (dataInicio) {
            where += ` AND date(c.dataEmissao) >= date(?)`;
            params.push(dataInicio);
        }
        if (dataFim) {
            where += ` AND date(c.dataEmissao) <= date(?)`;
            params.push(dataFim);
        }

        const sql = `
            SELECT
                s.residuo AS tipoResiduo,
                COUNT(*) AS totalColetas,
                SUM(s.quantidade_kg) AS totalKg,
                MIN(c.dataEmissao) AS primeiraEmissao,
                MAX(c.dataEmissao) AS ultimaEmissao
            FROM Solicitacao s
            INNER JOIN Certificado c ON c.solicitacaoId = s.id
            ${where}
            GROUP BY s.residuo
            ORDER BY totalKg DESC
        `;

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Retorna relatório agregado por indústria:
 * - total de coletas concluídas
 * - total de resíduos (kg) por indústria
 *
 * @returns {Promise<Array>}
 */
function resumoPorIndustria() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                i.id AS industriaId,
                i.nome AS industriaNome,
                COUNT(s.id) AS totalColetasConcluidas,
                IFNULL(SUM(s.quantidade_kg), 0) AS totalKg
            FROM Industria i
            LEFT JOIN Solicitacao s ON s.industriaId = i.id AND s.status = 'Concluída'
            GROUP BY i.id, i.nome
            HAVING totalColetasConcluidas > 0
            ORDER BY totalKg DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    obterVisaoGeral,
    residuosPorTipo,
    resumoPorIndustria
};


