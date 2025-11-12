/**
 * Configuração e inicialização do banco de dados SQLite
 * Este arquivo cria a conexão com o banco de dados e inicializa todas as tabelas necessárias
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar conexão com o banco de dados SQLite
// O arquivo database.db será criado automaticamente na pasta backend
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite em:', dbPath);
    }
});

/**
 * Inicializa todas as tabelas do banco de dados
 * Executa em modo serialize para garantir que as tabelas sejam criadas em ordem
 */
db.serialize(() => {
    // Tabela Industria
    // Armazena informações das indústrias cadastradas no sistema
    db.run(`
        CREATE TABLE IF NOT EXISTS Industria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT NOT NULL UNIQUE,
            cep TEXT NOT NULL,
            endereco TEXT NOT NULL,
            bairro TEXT NOT NULL,
            cidade TEXT NOT NULL,
            uf TEXT NOT NULL CHECK(uf = 'GO')
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Industria:', err.message);
        } else {
            console.log('Tabela Industria criada ou já existe');
        }
    });

    // Tabela Coletora
    // Armazena informações das empresas coletoras licenciadas
    db.run(`
        CREATE TABLE IF NOT EXISTS Coletora (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT NOT NULL UNIQUE,
            licenca_goias TEXT NOT NULL,
            cep TEXT NOT NULL,
            endereco TEXT NOT NULL,
            bairro TEXT NOT NULL,
            cidade TEXT NOT NULL,
            uf TEXT NOT NULL CHECK(uf = 'GO')
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Coletora:', err.message);
        } else {
            console.log('Tabela Coletora criada ou já existe');
        }
    });

    // Tabela Solicitacao
    // Armazena as solicitações de coleta criadas pelas indústrias
    db.run(`
        CREATE TABLE IF NOT EXISTS Solicitacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            industriaId INTEGER NOT NULL,
            data TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Pendente', 'Aceita', 'Concluída')),
            residuo TEXT NOT NULL,
            quantidade_kg REAL NOT NULL,
            FOREIGN KEY (industriaId) REFERENCES Industria(id)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Solicitacao:', err.message);
        } else {
            console.log('Tabela Solicitacao criada ou já existe');
        }
    });

    // Tabela Certificado
    // Armazena os certificados de destinação final gerados após conclusão das coletas
    db.run(`
        CREATE TABLE IF NOT EXISTS Certificado (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            solicitacaoId INTEGER NOT NULL UNIQUE,
            coletoraId INTEGER NOT NULL,
            dataEmissao TEXT NOT NULL,
            hashVerificacao TEXT NOT NULL UNIQUE,
            FOREIGN KEY (solicitacaoId) REFERENCES Solicitacao(id),
            FOREIGN KEY (coletoraId) REFERENCES Coletora(id)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela Certificado:', err.message);
        } else {
            console.log('Tabela Certificado criada ou já existe');
        }
    });
});

// Exportar a conexão do banco de dados para uso em outros módulos
module.exports = db;
