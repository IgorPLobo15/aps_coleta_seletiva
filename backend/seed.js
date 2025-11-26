/**
 * Script de Seed - População do Banco de Dados
 * 
 * Este script popula o banco de dados com dados de exemplo para testes e demonstração.
 * Execute com: node seed.js
 * 
 * ATENÇÃO: Este script irá limpar TODOS os dados existentes antes de inserir os novos.
 */

const db = require('./database');
const { gerarHashCertificado } = require('./utils/hashGenerator');

// Aguardar um tempo em milissegundos
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dados de exemplo - Indústrias de Goiás
const industrias = [
    { nome: 'Metalúrgica Goiás Ltda', cnpj: '12.345.678/0001-90', cep: '74000-000', endereco: 'Av. T-4, 500', bairro: 'Setor Bueno', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Química Industrial S.A.', cnpj: '23.456.789/0001-01', cep: '74100-000', endereco: 'Rua 10, 250', bairro: 'Marista', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Indústria de Plásticos Anápolis', cnpj: '34.567.890/0001-12', cep: '75000-000', endereco: 'Av. Brasil, 1000', bairro: 'Centro', cidade: 'Anápolis', uf: 'GO' },
    { nome: 'Fábrica de Papel e Celulose', cnpj: '45.678.901/0001-23', cep: '75150-000', endereco: 'Rodovia GO-060, Km 12', bairro: 'Industrial', cidade: 'Aparecida de Goiânia', uf: 'GO' },
    { nome: 'Indústria Têxtil Goiana', cnpj: '56.789.012/0001-34', cep: '74400-000', endereco: 'Av. Contorno, 800', bairro: 'Jardim Goiás', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Empresa de Materiais de Construção', cnpj: '67.890.123/0001-45', cep: '75200-000', endereco: 'Rua das Indústrias, 500', bairro: 'Industrial', cidade: 'Rio Verde', uf: 'GO' },
    { nome: 'Indústria de Bebidas Goiás', cnpj: '78.901.234/0001-56', cep: '74000-000', endereco: 'Av. T-1, 300', bairro: 'Setor Oeste', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Metalúrgica Jataí S.A.', cnpj: '89.012.345/0001-67', cep: '75800-000', endereco: 'Rua Industrial, 200', bairro: 'Setor Industrial', cidade: 'Jataí', uf: 'GO' },
    { nome: 'Fábrica de Produtos Químicos', cnpj: '90.123.456/0001-78', cep: '74150-000', endereco: 'Av. Independência, 1500', bairro: 'Campinas', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Indústria de Alimentos Processados', cnpj: '01.234.567/0001-89', cep: '75000-000', endereco: 'Av. Tiradentes, 600', bairro: 'Jardim Primavera', cidade: 'Anápolis', uf: 'GO' }
];

// Dados de exemplo - Coletoras de Goiás
const coletoras = [
    { nome: 'Coletora Ambiental Goiás Ltda', cnpj: '98.765.432/0001-10', licenca_goias: 'LIC-GO-2024-001', cep: '74100-000', endereco: 'Av. T-2, 100', bairro: 'Setor Oeste', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Reciclagem Verde S.A.', cnpj: '87.654.321/0001-21', licenca_goias: 'LIC-GO-2024-002', cep: '74000-000', endereco: 'Rua 5, 400', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO' },
    { nome: 'Eco Coleta Industrial', cnpj: '76.543.210/0001-32', licenca_goias: 'LIC-GO-2024-003', cep: '75150-000', endereco: 'Av. Goiás, 750', bairro: 'Industrial', cidade: 'Aparecida de Goiânia', uf: 'GO' },
    { nome: 'Gestão de Resíduos Anápolis', cnpj: '65.432.109/0001-43', licenca_goias: 'LIC-GO-2024-004', cep: '75000-000', endereco: 'Rodovia BR-060, Km 5', bairro: 'Distrito Industrial', cidade: 'Anápolis', uf: 'GO' },
    { nome: 'Coleta Seletiva Sustentável', cnpj: '54.321.098/0001-54', licenca_goias: 'LIC-GO-2024-005', cep: '74400-000', endereco: 'Rua dos Resíduos, 300', bairro: 'Vila Nova', cidade: 'Goiânia', uf: 'GO' }
];

// Tipos de resíduos variados
const tiposResiduos = [
    'Plástico Industrial',
    'Metal Ferroso',
    'Metal Não-Ferroso',
    'Papel e Papelão',
    'Resíduo Químico',
    'Óleo Usado',
    'Lixo Eletrônico',
    'Tecido Industrial',
    'Vidro Industrial',
    'Borracha Industrial',
    'Madeira Processada',
    'Resíduo Orgânico Industrial',
    'Sucata Metálica',
    'Embalagens Plásticas',
    'Resíduo de Construção Civil'
];

/**
 * Função auxiliar para gerar uma data aleatória nos últimos 90 dias
 */
function gerarDataAleatoria(diasAtras = 0) {
    const hoje = new Date();
    const data = new Date(hoje);
    data.setDate(data.getDate() - diasAtras);
    // Adicionar horas aleatórias entre 8h e 18h
    const horas = Math.floor(Math.random() * 10) + 8;
    const minutos = Math.floor(Math.random() * 60);
    data.setHours(horas, minutos, 0, 0);
    return data.toISOString();
}

/**
 * Função auxiliar para gerar quantidade aleatória de resíduos
 */
function gerarQuantidadeAleatoria(min = 50, max = 2000) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

/**
 * Limpa todas as tabelas (em ordem reversa devido a foreign keys)
 */
async function limparBanco() {
    return new Promise((resolve, reject) => {
        console.log('\n🧹 Limpando banco de dados...');
        
        // Desabilitar verificação de foreign keys temporariamente para limpar
        db.run('PRAGMA foreign_keys = OFF', (err) => {
            if (err) {
                console.warn('Aviso ao desabilitar foreign keys:', err.message);
            }
            
            db.serialize(() => {
                db.run('DELETE FROM Certificado', (err) => {
                    if (err && !err.message.includes('no such table')) {
                        console.error('Erro ao limpar Certificado:', err);
                    }
                });
                
                db.run('DELETE FROM Solicitacao', (err) => {
                    if (err && !err.message.includes('no such table')) {
                        console.error('Erro ao limpar Solicitacao:', err);
                    }
                });
                
                db.run('DELETE FROM Coletora', (err) => {
                    if (err && !err.message.includes('no such table')) {
                        console.error('Erro ao limpar Coletora:', err);
                    }
                });
                
                db.run('DELETE FROM Industria', (err) => {
                    if (err && !err.message.includes('no such table')) {
                        console.error('Erro ao limpar Industria:', err);
                    }
                    
                    // Reabilitar verificação de foreign keys
                    db.run('PRAGMA foreign_keys = ON', (err) => {
                        if (err) {
                            console.warn('Aviso ao reabilitar foreign keys:', err.message);
                        }
                        console.log('✅ Banco de dados limpo com sucesso!');
                        resolve();
                    });
                });
            });
        });
    });
}

/**
 * Insere indústrias no banco
 */
async function inserirIndustrias() {
    return new Promise((resolve, reject) => {
        console.log('\n🏭 Inserindo indústrias...');
        const promises = [];
        
        industrias.forEach((industria) => {
            const promise = new Promise((resolveInsert, rejectInsert) => {
                const sql = `INSERT INTO Industria (nome, cnpj, cep, endereco, bairro, cidade, uf)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [
                    industria.nome,
                    industria.cnpj,
                    industria.cep,
                    industria.endereco,
                    industria.bairro,
                    industria.cidade,
                    industria.uf
                ], function(err) {
                    if (err) {
                        console.error(`Erro ao inserir indústria ${industria.nome}:`, err.message);
                        rejectInsert(err);
                    } else {
                        resolveInsert(this.lastID);
                    }
                });
            });
            promises.push(promise);
        });
        
        Promise.all(promises).then(() => {
            console.log(`✅ ${industrias.length} indústrias inseridas!`);
            resolve();
        }).catch(reject);
    });
}

/**
 * Insere coletoras no banco
 */
async function inserirColetoras() {
    return new Promise((resolve, reject) => {
        console.log('\n🚛 Inserindo coletoras...');
        const promises = [];
        
        coletoras.forEach((coletora) => {
            const promise = new Promise((resolveInsert, rejectInsert) => {
                const sql = `INSERT INTO Coletora (nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [
                    coletora.nome,
                    coletora.cnpj,
                    coletora.licenca_goias,
                    coletora.cep,
                    coletora.endereco,
                    coletora.bairro,
                    coletora.cidade,
                    coletora.uf
                ], function(err) {
                    if (err) {
                        console.error(`Erro ao inserir coletora ${coletora.nome}:`, err.message);
                        rejectInsert(err);
                    } else {
                        resolveInsert(this.lastID);
                    }
                });
            });
            promises.push(promise);
        });
        
        Promise.all(promises).then(() => {
            console.log(`✅ ${coletoras.length} coletoras inseridas!`);
            resolve();
        }).catch(reject);
    });
}

/**
 * Busca IDs de indústrias e coletoras
 */
async function buscarIds() {
    return new Promise((resolve, reject) => {
        Promise.all([
            new Promise((res, rej) => {
                db.all('SELECT id FROM Industria', [], (err, rows) => {
                    if (err) rej(err);
                    else res(rows.map(r => r.id));
                });
            }),
            new Promise((res, rej) => {
                db.all('SELECT id FROM Coletora', [], (err, rows) => {
                    if (err) rej(err);
                    else res(rows.map(r => r.id));
                });
            })
        ]).then(([industriaIds, coletoraIds]) => {
            resolve({ industriaIds, coletoraIds });
        }).catch(reject);
    });
}

/**
 * Insere solicitações e certificados
 */
async function inserirSolicitacoesECertificados(industriaIds, coletoraIds) {
    return new Promise((resolve, reject) => {
        console.log('\n📦 Inserindo solicitações e certificados...');
        
        // Criar aproximadamente 50 solicitações com diferentes status
        const totalSolicitacoes = 50;
        let solicitacoesInseridas = 0;
        let certificadosInseridos = 0;
        const promises = [];
        
        // Distribuição aproximada:
        // - 15 pendentes (30%)
        // - 10 aceitas (20%)
        // - 25 concluídas (50%)
        
        for (let i = 0; i < totalSolicitacoes; i++) {
            const industriaId = industriaIds[Math.floor(Math.random() * industriaIds.length)];
            const residuo = tiposResiduos[Math.floor(Math.random() * tiposResiduos.length)];
            const quantidade = gerarQuantidadeAleatoria();
            
            let status;
            let diasAtras;
            
            if (i < 15) {
                // 15 pendentes
                status = 'Pendente';
                diasAtras = Math.floor(Math.random() * 30); // Últimos 30 dias
            } else if (i < 25) {
                // 10 aceitas
                status = 'Aceita';
                diasAtras = Math.floor(Math.random() * 45); // Últimos 45 dias
            } else {
                // 25 concluídas
                status = 'Concluída';
                diasAtras = Math.floor(Math.random() * 90); // Últimos 90 dias
            }
            
            const data = gerarDataAleatoria(diasAtras);
            
            const promise = new Promise((resolveInsert, rejectInsert) => {
                const sql = `INSERT INTO Solicitacao (industriaId, data, status, residuo, quantidade_kg)
                             VALUES (?, ?, ?, ?, ?)`;
                
                db.run(sql, [industriaId, data, status, residuo, quantidade], function(err) {
                    if (err) {
                        console.error(`Erro ao inserir solicitação ${i + 1}:`, err.message);
                        rejectInsert(err);
                    } else {
                        solicitacoesInseridas++;
                        const solicitacaoId = this.lastID;
                        
                        // Se for concluída, criar certificado
                        if (status === 'Concluída') {
                            const coletoraId = coletoraIds[Math.floor(Math.random() * coletoraIds.length)];
                            const dataEmissao = gerarDataAleatoria(diasAtras - Math.floor(Math.random() * 7)); // Certificado alguns dias depois
                            const hashVerificacao = gerarHashCertificado(solicitacaoId, coletoraId, dataEmissao);
                            
                            const sqlCert = `INSERT INTO Certificado (solicitacaoId, coletoraId, dataEmissao, hashVerificacao)
                                             VALUES (?, ?, ?, ?)`;
                            
                            db.run(sqlCert, [solicitacaoId, coletoraId, dataEmissao, hashVerificacao], function(err) {
                                if (err) {
                                    console.error(`Erro ao inserir certificado para solicitação ${solicitacaoId}:`, err.message);
                                    // Não rejeita, apenas continua
                                } else {
                                    certificadosInseridos++;
                                }
                                resolveInsert();
                            });
                        } else {
                            resolveInsert();
                        }
                    }
                });
            });
            
            promises.push(promise);
        }
        
        Promise.all(promises).then(() => {
            console.log(`✅ ${solicitacoesInseridas} solicitações inseridas!`);
            console.log(`✅ ${certificadosInseridos} certificados inseridos!`);
            resolve();
        }).catch(reject);
    });
}

/**
 * Aguarda a inicialização das tabelas do banco
 */
async function aguardarTabelas() {
    return new Promise((resolve) => {
        // Dar tempo para o database.js criar as tabelas
        setTimeout(() => {
            console.log('✅ Tabelas verificadas');
            resolve();
        }, 1000);
    });
}

/**
 * Função principal
 */
async function popularBanco() {
    try {
        console.log('===========================================');
        console.log('🌱 Iniciando população do banco de dados');
        console.log('===========================================');
        
        // Aguardar inicialização das tabelas
        await aguardarTabelas();
        
        // Limpar banco
        await limparBanco();
        await sleep(500);
        
        // Inserir indústrias
        await inserirIndustrias();
        await sleep(500);
        
        // Inserir coletoras
        await inserirColetoras();
        await sleep(500);
        
        // Buscar IDs
        const { industriaIds, coletoraIds } = await buscarIds();
        console.log(`\n📊 IDs encontrados: ${industriaIds.length} indústrias, ${coletoraIds.length} coletoras`);
        
        // Inserir solicitações e certificados
        await inserirSolicitacoesECertificados(industriaIds, coletoraIds);
        
        console.log('\n===========================================');
        console.log('✅ População do banco concluída com sucesso!');
        console.log('===========================================');
        console.log(`\n📈 Resumo:`);
        console.log(`   - ${industrias.length} indústrias`);
        console.log(`   - ${coletoras.length} coletoras`);
        console.log(`   - ~50 solicitações (com diferentes status)`);
        console.log(`   - ~25 certificados gerados`);
        
        // Fechar conexão
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar banco:', err);
            } else {
                console.log('\n🔒 Conexão com banco de dados fechada.');
                process.exit(0);
            }
        });
        
    } catch (erro) {
        console.error('\n❌ Erro ao popular banco de dados:', erro);
        db.close();
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    popularBanco();
}

module.exports = { popularBanco };

