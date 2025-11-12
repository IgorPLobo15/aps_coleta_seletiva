/**
 * Arquivo JavaScript para gerenciar o cadastro de indústrias e coletoras
 * Contém funções para integração com ViaCEP e API backend
 */

// ==================== FUNÇÕES DE BUSCA DE CEP ====================

/**
 * Busca informações de endereço através do CEP usando a API ViaCEP
 * Específico para o formulário de indústria
 * @param {string} cep - CEP a ser consultado (formato: 12345-678 ou 12345678)
 */
async function buscarCEPIndustria(cep) {
    // Remove caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
        return;
    }

    try {
        // Faz a requisição para a API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        // Verifica se o CEP foi encontrado
        if (data.erro) {
            alert('CEP não encontrado! Por favor, verifique o CEP digitado.');
            limparCamposEnderecoIndustria();
            return;
        }

        // Valida se o endereço é de Goiás
        if (data.uf !== 'GO') {
            alert('Erro: Apenas empresas localizadas no estado de Goiás (GO) podem ser cadastradas no sistema!');
            limparCamposEnderecoIndustria();
            return;
        }

        // Preenche automaticamente os campos de endereço
        document.getElementById('industria-endereco').value = data.logradouro || '';
        document.getElementById('industria-bairro').value = data.bairro || '';
        document.getElementById('industria-cidade').value = data.localidade || '';
        document.getElementById('industria-uf').value = data.uf || '';

    } catch (erro) {
        console.error('Erro ao buscar CEP:', erro);
        alert('Erro ao buscar CEP. Por favor, tente novamente.');
    }
}

/**
 * Busca informações de endereço através do CEP usando a API ViaCEP
 * Específico para o formulário de coletora
 * @param {string} cep - CEP a ser consultado (formato: 12345-678 ou 12345678)
 */
async function buscarCEPColetora(cep) {
    // Remove caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
        return;
    }

    try {
        // Faz a requisição para a API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        // Verifica se o CEP foi encontrado
        if (data.erro) {
            alert('CEP não encontrado! Por favor, verifique o CEP digitado.');
            limparCamposEnderecoColetora();
            return;
        }

        // Valida se o endereço é de Goiás
        if (data.uf !== 'GO') {
            alert('Erro: Apenas empresas localizadas no estado de Goiás (GO) podem ser cadastradas no sistema!');
            limparCamposEnderecoColetora();
            return;
        }

        // Preenche automaticamente os campos de endereço
        document.getElementById('coletora-endereco').value = data.logradouro || '';
        document.getElementById('coletora-bairro').value = data.bairro || '';
        document.getElementById('coletora-cidade').value = data.localidade || '';
        document.getElementById('coletora-uf').value = data.uf || '';

    } catch (erro) {
        console.error('Erro ao buscar CEP:', erro);
        alert('Erro ao buscar CEP. Por favor, tente novamente.');
    }
}

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Limpa os campos de endereço do formulário de indústria
 */
function limparCamposEnderecoIndustria() {
    document.getElementById('industria-endereco').value = '';
    document.getElementById('industria-bairro').value = '';
    document.getElementById('industria-cidade').value = '';
    document.getElementById('industria-uf').value = '';
}

/**
 * Limpa os campos de endereço do formulário de coletora
 */
function limparCamposEnderecoColetora() {
    document.getElementById('coletora-endereco').value = '';
    document.getElementById('coletora-bairro').value = '';
    document.getElementById('coletora-cidade').value = '';
    document.getElementById('coletora-uf').value = '';
}

/**
 * Limpa todos os campos do formulário de indústria
 */
function limparFormularioIndustria() {
    document.getElementById('formIndustria').reset();
}

/**
 * Limpa todos os campos do formulário de coletora
 */
function limparFormularioColetora() {
    document.getElementById('formColetora').reset();
}

// ==================== FUNÇÕES DE CADASTRO ====================

/**
 * Cadastra uma nova indústria no sistema
 * Envia os dados para a API backend via POST /industrias
 * @param {Event} event - Evento de submit do formulário
 */
async function cadastrarIndustria(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    try {
        // Coleta os dados do formulário
        const dados = {
            nome: document.getElementById('industria-nome').value.trim(),
            cnpj: document.getElementById('industria-cnpj').value.trim(),
            cep: document.getElementById('industria-cep').value.trim(),
            endereco: document.getElementById('industria-endereco').value.trim(),
            bairro: document.getElementById('industria-bairro').value.trim(),
            cidade: document.getElementById('industria-cidade').value.trim(),
            uf: document.getElementById('industria-uf').value.trim()
        };

        // Valida se todos os campos obrigatórios estão preenchidos
        if (!dados.nome || !dados.cnpj || !dados.cep || !dados.endereco ||
            !dados.bairro || !dados.cidade || !dados.uf) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        // Valida se a UF é Goiás
        if (dados.uf !== 'GO') {
            alert('Erro: Apenas empresas de Goiás podem ser cadastradas!');
            return;
        }

        // Envia os dados para a API usando a função auxiliar apiPost
        const resultado = await apiPost('/industrias', dados);

        // Exibe mensagem de sucesso
        alert(`Indústria "${resultado.nome}" cadastrada com sucesso!\nID: ${resultado.id}`);

        // Limpa o formulário após o cadastro
        limparFormularioIndustria();

    } catch (erro) {
        // Trata erros e exibe mensagem amigável
        console.error('Erro ao cadastrar indústria:', erro);

        // Verifica se é erro de CNPJ duplicado
        if (erro.message.includes('CNPJ')) {
            alert('Erro: Este CNPJ já está cadastrado no sistema!');
        } else {
            alert(`Erro ao cadastrar indústria: ${erro.message}`);
        }
    }
}

/**
 * Cadastra uma nova empresa coletora no sistema
 * Envia os dados para a API backend via POST /coletoras
 * @param {Event} event - Evento de submit do formulário
 */
async function cadastrarColetora(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    try {
        // Coleta os dados do formulário
        const dados = {
            nome: document.getElementById('coletora-nome').value.trim(),
            cnpj: document.getElementById('coletora-cnpj').value.trim(),
            licenca_goias: document.getElementById('coletora-licenca').value.trim(),
            cep: document.getElementById('coletora-cep').value.trim(),
            endereco: document.getElementById('coletora-endereco').value.trim(),
            bairro: document.getElementById('coletora-bairro').value.trim(),
            cidade: document.getElementById('coletora-cidade').value.trim(),
            uf: document.getElementById('coletora-uf').value.trim()
        };

        // Valida se todos os campos obrigatórios estão preenchidos
        if (!dados.nome || !dados.cnpj || !dados.licenca_goias || !dados.cep ||
            !dados.endereco || !dados.bairro || !dados.cidade || !dados.uf) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        // Valida se a UF é Goiás
        if (dados.uf !== 'GO') {
            alert('Erro: Apenas empresas de Goiás podem ser cadastradas!');
            return;
        }

        // Envia os dados para a API usando a função auxiliar apiPost
        const resultado = await apiPost('/coletoras', dados);

        // Exibe mensagem de sucesso
        alert(`Coletora "${resultado.nome}" cadastrada com sucesso!\nID: ${resultado.id}\nLicença: ${resultado.licenca_goias}`);

        // Limpa o formulário após o cadastro
        limparFormularioColetora();

    } catch (erro) {
        // Trata erros e exibe mensagem amigável
        console.error('Erro ao cadastrar coletora:', erro);

        // Verifica se é erro de CNPJ duplicado
        if (erro.message.includes('CNPJ')) {
            alert('Erro: Este CNPJ já está cadastrado no sistema!');
        } else {
            alert(`Erro ao cadastrar coletora: ${erro.message}`);
        }
    }
}

// ==================== INICIALIZAÇÃO ====================

/**
 * Função executada quando a página é carregada
 * Configura os event listeners dos formulários
 */
document.addEventListener('DOMContentLoaded', function () {
    // Adiciona event listener para o formulário de indústria
    const formIndustria = document.getElementById('formIndustria');
    if (formIndustria) {
        formIndustria.addEventListener('submit', cadastrarIndustria);
    }

    // Adiciona event listener para o formulário de coletora
    const formColetora = document.getElementById('formColetora');
    if (formColetora) {
        formColetora.addEventListener('submit', cadastrarColetora);
    }

    console.log('Página de cadastro carregada com sucesso!');
});
