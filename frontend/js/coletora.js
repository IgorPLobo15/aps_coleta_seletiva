/**
 * Arquivo JavaScript para o Dashboard da Coletora
 * Gerencia a visualização e ações sobre coletas pendentes e aceitas
 */

// Lista de coletoras carregada do backend
let coletorasDisponiveis = [];

/**
 * Carrega todas as coletoras licenciadas em Goiás
 * Necessário para o select de coletoras ao finalizar uma coleta
 * @returns {Promise<void>}
 */
async function carregarColetoras() {
    try {
        // Buscar coletoras via API
        const resultado = await apiGet('/coletoras/goias');
        coletorasDisponiveis = Array.isArray(resultado) ? resultado : [];
        console.log('Coletoras carregadas:', coletorasDisponiveis.length);
    } catch (erro) {
        console.error('Erro ao carregar coletoras:', erro);
        coletorasDisponiveis = [];
        // Não mostrar alert aqui para não bloquear a interface
        console.warn('Continuando sem lista de coletoras disponível');
    }
}

/**
 * Carrega todas as solicitações com status "Pendente"
 * Atualiza a tabela de coletas pendentes na interface
 * @returns {Promise<void>}
 */
async function carregarPendentes() {
    try {
        // Buscar solicitações pendentes via API
        const solicitacoes = await apiGet('/solicitacoes/pendentes');

        // Obter referência da tabela
        const tbody = document.getElementById('tabelaPendentes');

        // Limpar conteúdo atual da tabela
        tbody.innerHTML = '';

        // Verificar se há solicitações pendentes
        if (solicitacoes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                        Nenhuma coleta pendente no momento
                    </td>
                </tr>
            `;
            return;
        }

        // Preencher tabela com as solicitações pendentes
        solicitacoes.forEach(solicitacao => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';

            // Formatar data para exibição legível (DD/MM/YYYY HH:MM)
            const dataFormatada = formatarData(solicitacao.data);

            tr.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.id}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.industriaNome}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${dataFormatada}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.residuo}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.quantidade_kg.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm">
                    <button 
                        onclick="aceitarSolicitacao(${solicitacao.id})"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 text-sm font-medium">
                        Aceitar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log('Solicitações pendentes carregadas:', solicitacoes.length);

    } catch (erro) {
        console.error('Erro ao carregar solicitações pendentes:', erro);
        const tbody = document.getElementById('tabelaPendentes');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-red-500">
                    Erro ao carregar coletas pendentes: ${erro.message}
                </td>
            </tr>
        `;
    }
}

/**
 * Carrega todas as solicitações com status "Aceita"
 * Busca do backend e atualiza a tabela de coletas aceitas na interface
 * @returns {Promise<void>}
 */
async function carregarAceitas() {
    try {
        // Buscar solicitações aceitas via API
        const solicitacoes = await apiGet('/solicitacoes/aceitas');

        const tbody = document.getElementById('tabelaAceitas');
        tbody.innerHTML = '';

        // Verificar se há solicitações aceitas
        if (solicitacoes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                        Nenhuma coleta aceita aguardando finalização
                    </td>
                </tr>
            `;
            return;
        }

        // Preencher tabela com as solicitações aceitas
        solicitacoes.forEach(solicitacao => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';

            // Formatar data para exibição legível
            const dataFormatada = formatarData(solicitacao.data);

            // Criar select de coletoras
            const selectId = `select-coletora-${solicitacao.id}`;
            let optionsHTML = '<option value="">Selecione a coletora</option>';
            coletorasDisponiveis.forEach(coletora => {
                optionsHTML += `<option value="${coletora.id}">${coletora.nome}</option>`;
            });

            tr.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.id}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.industriaNome}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${dataFormatada}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.residuo}</td>
                <td class="px-4 py-3 text-sm text-gray-700">${solicitacao.quantidade_kg.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm">
                    <div class="flex items-center space-x-2">
                        <select 
                            id="${selectId}"
                            class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500">
                            ${optionsHTML}
                        </select>
                        <button 
                            onclick="concluirColeta(${solicitacao.id}, '${selectId}')"
                            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 text-sm font-medium whitespace-nowrap">
                            Finalizar Coleta
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log('Solicitações aceitas carregadas:', solicitacoes.length);

    } catch (erro) {
        console.error('Erro ao carregar solicitações aceitas:', erro);
        const tbody = document.getElementById('tabelaAceitas');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-red-500">
                    Erro ao carregar coletas aceitas: ${erro.message}
                </td>
            </tr>
        `;
    }
}

/**
 * Aceita uma solicitação pendente
 * Atualiza o status da solicitação para "Aceita" no backend
 * Solicita confirmação do usuário antes de executar a ação
 * @param {number} id - ID da solicitação a ser aceita
 * @returns {Promise<void>}
 */
async function aceitarSolicitacao(id) {
    try {
        // Solicitar confirmação do usuário
        const confirmacao = confirm(`Deseja realmente aceitar a solicitação #${id}?`);

        if (!confirmacao) {
            return; // Usuário cancelou a ação
        }

        // Chamar API para aceitar a solicitação
        const solicitacaoAtualizada = await apiPut(`/solicitacoes/${id}/aceitar`);

        console.log('Solicitação aceita:', solicitacaoAtualizada);

        // Exibir mensagem de sucesso
        alert(`Solicitação #${id} aceita com sucesso!`);

        // Atualizar ambas as tabelas
        await carregarPendentes(); // Remove da lista de pendentes
        await carregarAceitas();   // Adiciona na lista de aceitas

    } catch (erro) {
        console.error('Erro ao aceitar solicitação:', erro);
        alert(`Erro ao aceitar solicitação: ${erro.message}`);
    }
}

/**
 * Finaliza uma coleta aceita e gera certificado
 * Atualiza o status da solicitação para "Concluída" e cria um certificado
 * Solicita confirmação do usuário antes de executar a ação
 * @param {number} id - ID da solicitação a ser concluída
 * @param {string} selectId - ID do elemento select que contém a coletora selecionada
 * @returns {Promise<void>}
 */
async function concluirColeta(id, selectId) {
    try {
        // Obter o valor selecionado no select de coletoras
        const selectElement = document.getElementById(selectId);
        const coletoraId = parseInt(selectElement.value);

        // Validar se uma coletora foi selecionada
        if (!coletoraId || isNaN(coletoraId)) {
            alert('Por favor, selecione uma coletora antes de finalizar a coleta.');
            return;
        }

        // Solicitar confirmação do usuário
        const coletoraName = selectElement.options[selectElement.selectedIndex].text;
        const confirmacao = confirm(
            `Deseja realmente finalizar a coleta #${id} com a coletora "${coletoraName}"?\n\n` +
            `Esta ação irá gerar um certificado de destinação final.`
        );

        if (!confirmacao) {
            return; // Usuário cancelou a ação
        }

        // Chamar API para concluir a solicitação
        const resultado = await apiPost(`/solicitacoes/${id}/concluir`, {
            coletoraId: coletoraId
        });

        console.log('Coleta concluída:', resultado);

        // Exibir mensagem de sucesso com informações do certificado
        alert(
            `Coleta #${id} finalizada com sucesso!\n\n` +
            `Certificado gerado:\n` +
            `ID: ${resultado.certificado.id}\n` +
            `Hash: ${resultado.certificado.hashVerificacao}`
        );

        // Atualizar ambas as tabelas
        await carregarPendentes(); // Atualiza pendentes (caso haja mudanças)
        await carregarAceitas();   // Remove da lista de aceitas

    } catch (erro) {
        console.error('Erro ao concluir coleta:', erro);
        alert(`Erro ao finalizar coleta: ${erro.message}`);
    }
}

/**
 * Formata uma data ISO para formato legível brasileiro (DD/MM/YYYY HH:MM)
 * @param {string} dataISO - Data no formato ISO 8601
 * @returns {string} Data formatada
 */
function formatarData(dataISO) {
    const data = new Date(dataISO);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

/**
 * Função de inicialização
 * Carrega todos os dados necessários quando a página é aberta
 * Executada automaticamente ao carregar o script
 */
async function init() {
    console.log('Inicializando dashboard da coletora...');

    // Carregar coletoras primeiro (necessário para o select)
    await carregarColetoras();

    // Carregar solicitações pendentes
    await carregarPendentes();

    // Carregar solicitações aceitas
    await carregarAceitas();

    console.log('Dashboard da coletora inicializado com sucesso!');
}

// Executar função de inicialização quando a página carregar
// Aguarda o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM já está carregado
    init();
}
