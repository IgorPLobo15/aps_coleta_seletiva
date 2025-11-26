/**
 * Script de Relatórios
 * Consome os endpoints de /relatorios e exibe dados gerenciais.
 */

const RELATORIOS_API_BASE = 'http://localhost:3000/relatorios';

let dadosResiduosCache = [];

async function carregarVisaoGeral() {
    try {
        const dados = await apiGet('/relatorios/visao-geral');

        const container = document.getElementById('cardsVisaoGeral');
        container.innerHTML = '';

        const cards = [
            {
                titulo: 'Indústrias cadastradas',
                valor: dados.totalIndustrias || 0,
                cor: 'bg-blue-50 text-blue-800'
            },
            {
                titulo: 'Coletoras cadastradas',
                valor: dados.totalColetoras || 0,
                cor: 'bg-emerald-50 text-emerald-800'
            },
            {
                titulo: 'Solicitações totais',
                valor: dados.totalSolicitacoes || 0,
                cor: 'bg-gray-50 text-gray-800'
            },
            {
                titulo: 'Coletas concluídas',
                valor: dados.totalColetasConcluidas || 0,
                cor: 'bg-green-50 text-green-800'
            },
            {
                titulo: 'Resíduos destinados (kg)',
                valor: (dados.totalKgColetado || 0).toFixed(2),
                cor: 'bg-purple-50 text-purple-800'
            }
        ];

        cards.forEach(card => {
            const div = document.createElement('div');
            div.className = `${card.cor} rounded-lg p-4 shadow-sm`;
            div.innerHTML = `
                <p class="text-xs uppercase tracking-wide font-semibold mb-1">${card.titulo}</p>
                <p class="text-xl font-bold">${card.valor}</p>
            `;
            container.appendChild(div);
        });
    } catch (erro) {
        console.error('Erro ao carregar visão geral de relatórios:', erro);
        const container = document.getElementById('cardsVisaoGeral');
        container.innerHTML = `
            <p class="text-red-600 text-sm">
                Não foi possível carregar os indicadores gerais. Verifique se o backend está em execução.
            </p>
        `;
    }
}

async function carregarResiduosPorTipo() {
    try {
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;

        const params = new URLSearchParams();
        if (dataInicio) params.append('dataInicio', dataInicio);
        if (dataFim) params.append('dataFim', dataFim);

        const endpoint = params.toString()
            ? `/relatorios/residuos?${params.toString()}`
            : '/relatorios/residuos';

        const dados = await apiGet(endpoint);
        dadosResiduosCache = dados;

        const tbody = document.getElementById('tabelaResiduos');
        tbody.innerHTML = '';

        if (!dados || dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                        Nenhum dado encontrado para o período selecionado.
                    </td>
                </tr>
            `;
            return;
        }

        dados.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'border-b';

            const primeira = item.primeiraEmissao
                ? new Date(item.primeiraEmissao).toLocaleString('pt-BR')
                : '-';
            const ultima = item.ultimaEmissao
                ? new Date(item.ultimaEmissao).toLocaleString('pt-BR')
                : '-';

            tr.innerHTML = `
                <td class="px-4 py-2 text-gray-800">${item.tipoResiduo}</td>
                <td class="px-4 py-2 text-right text-gray-700">${item.totalColetas}</td>
                <td class="px-4 py-2 text-right text-gray-700">${Number(item.totalKg).toFixed(2)}</td>
                <td class="px-4 py-2 text-gray-600">${primeira}</td>
                <td class="px-4 py-2 text-gray-600">${ultima}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar resíduos por tipo:', erro);
        const tbody = document.getElementById('tabelaResiduos');
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-6 text-center text-red-500">
                    Erro ao carregar dados de resíduos: ${erro.message}
                </td>
            </tr>
        `;
    }
}

async function carregarResumoPorIndustria() {
    try {
        const dados = await apiGet('/relatorios/industria');
        const tbody = document.getElementById('tabelaIndustria');
        tbody.innerHTML = '';

        if (!dados || dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                        Ainda não há indústrias com coletas concluídas.
                    </td>
                </tr>
            `;
            return;
        }

        dados.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'border-b';
            tr.innerHTML = `
                <td class="px-4 py-2 text-gray-800">${item.industriaNome}</td>
                <td class="px-4 py-2 text-right text-gray-700">${item.totalColetasConcluidas}</td>
                <td class="px-4 py-2 text-right text-gray-700">${Number(item.totalKg).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar resumo por indústria:', erro);
        const tbody = document.getElementById('tabelaIndustria');
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="px-4 py-6 text-center text-red-500">
                    Erro ao carregar resumo por indústria: ${erro.message}
                </td>
            </tr>
        `;
    }
}

function exportarResiduosCsv() {
    if (!dadosResiduosCache || dadosResiduosCache.length === 0) {
        alert('Não há dados de resíduos para exportar.');
        return;
    }

    const cabecalho = [
        'tipo_residuo',
        'total_coletas',
        'total_kg',
        'primeira_emissao',
        'ultima_emissao'
    ];

    const linhas = dadosResiduosCache.map(item => [
        `"${(item.tipoResiduo || '').replace(/"/g, '""')}"`,
        item.totalColetas,
        Number(item.totalKg).toFixed(2),
        item.primeiraEmissao || '',
        item.ultimaEmissao || ''
    ].join(';'));

    const conteudo = [cabecalho.join(';'), ...linhas].join('\n');
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio_residuos_por_tipo.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function initRelatorios() {
    carregarVisaoGeral();
    carregarResiduosPorTipo();
    carregarResumoPorIndustria();

    const formFiltros = document.getElementById('formFiltros');
    if (formFiltros) {
        formFiltros.addEventListener('submit', (event) => {
            event.preventDefault();
            carregarResiduosPorTipo();
        });
    }

    const btnLimpar = document.getElementById('btnLimparFiltros');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            document.getElementById('dataInicio').value = '';
            document.getElementById('dataFim').value = '';
            carregarResiduosPorTipo();
        });
    }

    const btnExportar = document.getElementById('btnExportarCsv');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarResiduosCsv);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRelatorios);
} else {
    initRelatorios();
}


