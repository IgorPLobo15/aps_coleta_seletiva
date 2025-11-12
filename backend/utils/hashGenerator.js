/**
 * Utilitário para geração de hash de verificação de certificados
 * Utiliza SHA-256 para criar hashes únicos e seguros
 */

const crypto = require('crypto');

/**
 * Gera um hash único para o certificado de destinação final
 * O hash é baseado em múltiplos parâmetros para garantir unicidade
 * 
 * @param {number} solicitacaoId - ID da solicitação de coleta
 * @param {number} coletoraId - ID da empresa coletora
 * @param {string} dataEmissao - Data de emissão do certificado (ISO 8601)
 * @returns {string} Hash SHA-256 em formato hexadecimal
 */
function gerarHashCertificado(solicitacaoId, coletoraId, dataEmissao) {
    // Combina os parâmetros com timestamp atual para garantir unicidade absoluta
    // Mesmo que os mesmos parâmetros sejam usados, o timestamp garante hash diferente
    const timestamp = Date.now();
    const dados = `${solicitacaoId}-${coletoraId}-${dataEmissao}-${timestamp}`;

    // Gera hash SHA-256 dos dados concatenados
    const hash = crypto.createHash('sha256').update(dados).digest('hex');

    return hash;
}

module.exports = { gerarHashCertificado };
