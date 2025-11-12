/**
 * industria.js
 * Script para gerenciar o dashboard da indústria
 * Permite criar solicitações de coleta e visualizar histórico e certificados
 */

// URL base da API
const API_BASE_URL = 'http://localhost:3000';

// ID da indústria selecionada atualmente
let industriaSelecionadaId = null;

/**
 * Carrega todas as indústrias cadastradas e popula o select
 * Faz requisição GET para /industrias
 */
async function carregarIndustrias() {
    try {
        const response = await fetch(`${API_BASE_URL}/industrias`);

        if (!response.ok) {
            throw new Error('Erro ao carregar indústrias');
        }

        const industrias = await response.json();
        const selectIndustria = document.getElementById('selectIndustria');

        // Limpar opções existentes
        selectIndustria.innerHTML = '<option value="">Selecione uma indústria</option>';

        // Adicionar cada indústria como opção
        industrias.forEach(industria => {
            const option = document.createElement('option');
            option.value = industria.id;
            option.textContent = `${industria.nome} - ${industria.cnpj}`;
            selectIndustria.appendChild(option);
        });

        console.log('Indústrias carregadas com sucesso:', industrias.length);

    } catch (erro) {
        console.error('Erro ao carregar indústrias:', erro);
        alert('Erro ao carregar lista de indústrias. Verifique se o servidor está rodando.');
    }
}

/**
 * Cria uma nova solicitação de coleta
 * Faz requisição POST para /solicitacoes
 * @param {Event} event - Evento de submit do formulário
 */
async function criarSolicitacao(event) {
    event.preventDefault();

    // Obter valores do formulário
    const industriaId = document.getElementById('selectIndustria').value;
    const residuo = document.getElementById('residuo').value.trim();
    const quantidade_kg = parseFloat(document.getElementById('quantidade_kg').value);

    // Validações
    if (!industriaId) {
        alert('Por favor, selecione uma indústria');
        return;
    }

    if (!residuo) {
        alert('Por favor, informe o tipo de resíduo');
        return;
    }

    if (!quantidade_kg || quantidade_kg <= 0) {
        alert('Por favor, informe uma quantidade válida (maior que zero)');
        return;
    }

    try {
        // Preparar dados para envio
        const dados = {
            industriaId: parseInt(industriaId),
            residuo: residuo,
            quantidade_kg: quantidade_kg
        };

        // Fazer requisição POST
        const response = await fetch(`${API_BASE_URL}/solicitacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || 'Erro ao criar solicitação');
        }

        const solicitacao = await response.json();

        alert('Solicitação de coleta criada com sucesso!');
        console.log('Solicitação criada:', solicitacao);

        // Limpar formulário
        document.getElementById('residuo').value = '';
        document.getElementById('quantidade_kg').value = '';

        // Atualizar tabela de solicitações se houver indústria selecionada
        if (industriaSelecionadaId) {
            await carregarSolicitacoes(industriaSelecionadaId);
        }

    } catch (erro) {
        console.error('Erro ao criar solicitação:', erro);
        alert(`Erro: ${erro.message}`);
    }
}

/**
 * Carrega o histórico de solicitações de uma indústria específica
 * Faz requisição GET para /solicitacoes/industria/:id
 * @param {number} industriaId - ID da indústria
 */
async function carregarSolicitacoes(industriaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/solicitacoes/industria/${industriaId}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar solicitações');
        }

        const solicitacoes = await response.json();
        const tbody = document.getElementById('tabelaSolicitacoes');

        // Limpar tabela
        tbody.innerHTML = '';

        // Verificar se há solicitações
        if (solicitacoes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                        Nenhuma solicitação encontrada para esta indústria
                    </td>
                </tr>
            `;
            return;
        }

        // Adicionar cada solicitação na tabela
        solicitacoes.forEach(solicitacao => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';

            // Formatar data para exibição legível (DD/MM/YYYY HH:MM)
            const data = new Date(solicitacao.data);
            const dataFormatada = data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Definir cor do status
            let statusClass = '';
            let statusBadge = '';

            switch (solicitacao.status) {
                case 'Pendente':
                    statusClass = 'bg-yellow-100 text-yellow-800';
                    statusBadge = `<span class="px-3 py-1 rounded-full text-sm font-semibold ${statusClass}">${solicitacao.status}</span>`;
                    break;
                case 'Aceita':
                    statusClass = 'bg-blue-100 text-blue-800';
                    statusBadge = `<span class="px-3 py-1 rounded-full text-sm font-semibold ${statusClass}">${solicitacao.status}</span>`;
                    break;
                case 'Concluída':
                    statusClass = 'bg-green-100 text-green-800';
                    statusBadge = `<span class="px-3 py-1 rounded-full text-sm font-semibold ${statusClass}">${solicitacao.status}</span>`;
                    break;
                default:
                    statusBadge = solicitacao.status;
            }

            tr.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.id}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${dataFormatada}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.residuo}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.quantidade_kg.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm">${statusBadge}</td>
            `;

            tbody.appendChild(tr);
        });

        console.log('Solicitações carregadas:', solicitacoes.length);

    } catch (erro) {
        console.error('Erro ao carregar solicitações:', erro);
        const tbody = document.getElementById('tabelaSolicitacoes');
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-red-500">
                    Erro ao carregar solicitações. Verifique se o servidor está rodando.
                </td>
            </tr>
        `;
    }
}

/**
 * Carrega os certificados de destinação final de uma indústria específica
 * Faz requisição GET para /certificados/industria/:id
 * @param {number} industriaId - ID da indústria
 */
async function carregarCertificados(industriaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/certificados/industria/${industriaId}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar certificados');
        }

        const certificados = await response.json();
        const tbody = document.getElementById('tabelaCertificados');

        // Limpar tabela
        tbody.innerHTML = '';

        // Verificar se há certificados
        if (certificados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                        Nenhum certificado encontrado para esta indústria
                    </td>
                </tr>
            `;
            return;
        }

        // Adicionar cada certificado na tabela
        certificados.forEach(certificado => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';

            // Formatar data de emissão para exibição legível (DD/MM/YYYY HH:MM)
            const dataEmissao = new Date(certificado.dataEmissao);
            const dataFormatada = dataEmissao.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            tr.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-700">${certificado.id}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${dataFormatada}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${certificado.coletoraName || 'N/A'}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${certificado.residuo}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${certificado.quantidade_kg.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm">
                    <code class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono break-all">
                        ${certificado.hashVerificacao}
                    </code>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log('Certificados carregados:', certificados.length);

    } catch (erro) {
        console.error('Erro ao carregar certificados:', erro);
        const tbody = document.getElementById('tabelaCertificados');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-red-500">
                    Erro ao carregar certificados. Verifique se o servidor está rodando.
                </td>
            </tr>
        `;
    }
}

/**
 * Manipula a mudança de seleção de indústria
 * Carrega solicitações e certificados da indústria selecionada
 */
function aoSelecionarIndustria() {
    const selectIndustria = document.getElementById('selectIndustria');
    const industriaId = selectIndustria.value;

    if (industriaId) {
        industriaSelecionadaId = parseInt(industriaId);
        // Carregar dados da indústria selecionada
        carregarSolicitacoes(industriaSelecionadaId);
        carregarCertificados(industriaSelecionadaId);
    } else {
        industriaSelecionadaId = null;
        // Limpar tabelas
        document.getElementById('tabelaSolicitacoes').innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                    Selecione uma indústria para ver o histórico
                </td>
            </tr>
        `;
        document.getElementById('tabelaCertificados').innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    Selecione uma indústria para ver os certificados
                </td>
            </tr>
        `;
    }
}

/**
 * Função de inicialização
 * Executada quando a página é carregada
 * Configura event listeners e carrega dados iniciais
 */
function init() {
    console.log('Inicializando dashboard da indústria...');

    // Carregar lista de indústrias
    carregarIndustrias();

    // Configurar event listener para o formulário de solicitação
    const formSolicitacao = document.getElementById('formSolicitacao');
    formSolicitacao.addEventListener('submit', criarSolicitacao);

    // Configurar event listener para mudança de seleção de indústria
    const selectIndustria = document.getElementById('selectIndustria');
    selectIndustria.addEventListener('change', aoSelecionarIndustria);

    console.log('Dashboard da indústria inicializado com sucesso');
}

// Executar função de inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
