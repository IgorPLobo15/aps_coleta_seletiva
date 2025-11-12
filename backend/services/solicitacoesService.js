/**
 * Service de Solicitações
 * Contém toda a lógica de negócio relacionada às solicitações de coleta
 */

const db = require('../database');

/**
 * Cria uma nova solicitação de coleta
 * Define automaticamente o status como "Pendente" e a data atual
 * @param {Object} dados - Dados da solicitação (industriaId, residuo, quantidade_kg)
 * @returns {Promise<Object>} Solicitação criada
 */
function criar(dados) {
    return new Promise((resolve, reject) => {
        const { industriaId, residuo, quantidade_kg } = dados;

        // Define status "Pendente" e data atual automaticamente
        const status = 'Pendente';
        const data = new Date().toISOString();

        const sql = `
            INSERT INTO Solicitacao (industriaId, data, status, residuo, quantidade_kg)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(sql, [industriaId, data, status, residuo, quantidade_kg], function (err) {
            if (err) {
                reject(err);
            } else {
                // Retorna a solicitação criada com o ID gerado
                resolve({
                    id: this.lastID,
                    industriaId,
                    data,
                    status,
                    residuo,
                    quantidade_kg
                });
            }
        });
    });
}

/**
 * Busca todas as solicitações de uma indústria específica
 * Retorna o histórico completo de solicitações ordenado por data (mais recente primeiro)
 * @param {number} industriaId - ID da indústria
 * @returns {Promise<Array>} Lista de solicitações
 */
function buscarPorIndustria(industriaId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM Solicitacao
            WHERE industriaId = ?
            ORDER BY data DESC
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

/**
 * Busca todas as solicitações com status "Pendente"
 * Inclui o nome da indústria através de JOIN
 * Ordena por data (mais antiga primeiro) para priorizar solicitações antigas
 * @returns {Promise<Array>} Lista de solicitações pendentes com nome da indústria
 */
function buscarPendentes() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                s.id,
                s.industriaId,
                i.nome as industriaNome,
                s.data,
                s.status,
                s.residuo,
                s.quantidade_kg
            FROM Solicitacao s
            INNER JOIN Industria i ON s.industriaId = i.id
            WHERE s.status = 'Pendente'
            ORDER BY s.data ASC
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

/**
 * Busca todas as solicitações com status "Aceita"
 * Inclui o nome da indústria através de JOIN
 * Ordena por data (mais antiga primeiro)
 * @returns {Promise<Array>} Lista de solicitações aceitas com nome da indústria
 */
function buscarAceitas() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                s.id,
                s.industriaId,
                i.nome as industriaNome,
                s.data,
                s.status,
                s.residuo,
                s.quantidade_kg
            FROM Solicitacao s
            INNER JOIN Industria i ON s.industriaId = i.id
            WHERE s.status = 'Aceita'
            ORDER BY s.data ASC
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

/**
 * Aceita uma solicitação pendente
 * Valida que o status atual é "Pendente" antes de atualizar para "Aceita"
 * @param {number} id - ID da solicitação
 * @returns {Promise<Object>} Solicitação atualizada com nome da indústria
 */
function aceitar(id) {
    return new Promise((resolve, reject) => {
        // Primeiro, busca a solicitação com JOIN para incluir o nome da indústria
        const sqlSelect = `
            SELECT 
                s.id,
                s.industriaId,
                i.nome as industriaNome,
                s.data,
                s.status,
                s.residuo,
                s.quantidade_kg
            FROM Solicitacao s
            INNER JOIN Industria i ON s.industriaId = i.id
            WHERE s.id = ?
        `;

        db.get(sqlSelect, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('Solicitação não encontrada'));
            } else if (row.status !== 'Pendente') {
                reject(new Error(`Não é possível aceitar solicitação com status "${row.status}". Apenas solicitações "Pendente" podem ser aceitas.`));
            } else {
                // Atualiza o status para "Aceita"
                const sqlUpdate = `
                    UPDATE Solicitacao
                    SET status = 'Aceita'
                    WHERE id = ?
                `;

                db.run(sqlUpdate, [id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Retorna a solicitação atualizada com o nome da indústria
                        resolve({
                            ...row,
                            status: 'Aceita'
                        });
                    }
                });
            }
        });
    });
}

/**
 * Conclui uma solicitação aceita
 * Valida que o status atual é "Aceita" antes de atualizar para "Concluída"
 * @param {number} id - ID da solicitação
 * @returns {Promise<Object>} Solicitação atualizada
 */
function concluir(id) {
    return new Promise((resolve, reject) => {
        // Primeiro, busca a solicitação para validar o status atual
        const sqlSelect = `SELECT * FROM Solicitacao WHERE id = ?`;

        db.get(sqlSelect, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('Solicitação não encontrada'));
            } else if (row.status !== 'Aceita') {
                reject(new Error(`Não é possível concluir solicitação com status "${row.status}". Apenas solicitações "Aceita" podem ser concluídas.`));
            } else {
                // Atualiza o status para "Concluída"
                const sqlUpdate = `
                    UPDATE Solicitacao
                    SET status = 'Concluída'
                    WHERE id = ?
                `;

                db.run(sqlUpdate, [id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Retorna a solicitação atualizada
                        resolve({
                            ...row,
                            status: 'Concluída'
                        });
                    }
                });
            }
        });
    });
}

// Exporta todas as funções do service
module.exports = {
    criar,
    buscarPorIndustria,
    buscarPendentes,
    buscarAceitas,
    aceitar,
    concluir
};
