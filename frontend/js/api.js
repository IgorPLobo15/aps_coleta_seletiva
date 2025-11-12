/**
 * Arquivo de funções auxiliares para consumo da API REST
 * Contém funções genéricas para realizar requisições HTTP
 */

// URL base da API backend
const API_BASE_URL = 'http://localhost:3000';

/**
 * Realiza uma requisição GET para a API
 * @param {string} endpoint - Endpoint da API (ex: '/industrias')
 * @returns {Promise<Object>} Dados retornados pela API em formato JSON
 * @throws {Error} Lança erro se a requisição falhar
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            let mensagemErro = 'Erro na requisição GET';
            try {
                const erro = await response.json();
                mensagemErro = erro.erro || mensagemErro;
            } catch (e) {
                // Se não conseguir parsear JSON, usar mensagem padrão
                mensagemErro = `Erro ${response.status}: ${response.statusText}`;
            }
            throw new Error(mensagemErro);
        }

        return await response.json();
    } catch (erro) {
        console.error(`Erro ao fazer GET ${endpoint}:`, erro);
        throw erro;
    }
}

/**
 * Realiza uma requisição POST para a API
 * @param {string} endpoint - Endpoint da API (ex: '/industrias')
 * @param {Object} data - Dados a serem enviados no corpo da requisição
 * @returns {Promise<Object>} Dados retornados pela API em formato JSON
 * @throws {Error} Lança erro se a requisição falhar
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro na requisição POST');
        }

        return await response.json();
    } catch (erro) {
        console.error(`Erro ao fazer POST ${endpoint}:`, erro);
        throw erro;
    }
}

/**
 * Realiza uma requisição PUT para a API
 * @param {string} endpoint - Endpoint da API (ex: '/solicitacoes/1/aceitar')
 * @param {Object} data - Dados a serem enviados no corpo da requisição (opcional)
 * @returns {Promise<Object>} Dados retornados pela API em formato JSON
 * @throws {Error} Lança erro se a requisição falhar
 */
async function apiPut(endpoint, data = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro na requisição PUT');
        }

        return await response.json();
    } catch (erro) {
        console.error(`Erro ao fazer PUT ${endpoint}:`, erro);
        throw erro;
    }
}
