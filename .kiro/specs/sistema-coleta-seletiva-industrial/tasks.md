# Implementation Plan

- [x] 1. Configurar estrutura inicial do projeto backend





  - Criar diretório `backend/` com estrutura de pastas (routes, controllers, services, utils)
  - Inicializar package.json com dependências: express, sqlite3, cors, nodemon
  - Criar arquivo server.js como ponto de entrada da aplicação
  - _Requirements: 12.1, 12.2_

- [x] 2. Implementar configuração e inicialização do banco de dados SQLite





  - Criar arquivo database.js com conexão SQLite
  - Implementar criação automática das tabelas Industria, Coletora, Solicitacao e Certificado
  - Adicionar constraints de UNIQUE, CHECK e FOREIGN KEY conforme schema
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 3. Implementar utilitário de geração de hash para certificados




  - Criar arquivo utils/hashGenerator.js
  - Implementar função gerarHashCertificado usando crypto SHA-256
  - Garantir unicidade baseada em solicitacaoId, coletoraId, dataEmissao e timestamp
  - _Requirements: 10.3_

- [x] 4. Implementar endpoints de cadastro de indústrias





- [x] 4.1 Criar service de indústrias (services/industriasService.js)


  - Implementar função criar() para inserir indústria no banco
  - Implementar função listarTodas() para buscar todas as indústrias
  - Adicionar tratamento de erros de banco de dados
  - _Requirements: 2.1, 4.1, 4.2_


- [x] 4.2 Criar controller de indústrias (controllers/industriasController.js)

  - Implementar criarIndustria() com validação de campos obrigatórios
  - Implementar validação de UF = "GO"
  - Implementar listarIndustrias()
  - Adicionar tratamento de erro de CNPJ duplicado
  - _Requirements: 2.1, 2.2, 4.1_

- [x] 4.3 Criar rotas de indústrias (routes/industrias.js)


  - Definir POST /industrias
  - Definir GET /industrias
  - Conectar rotas aos controllers
  - _Requirements: 2.1, 4.1_

- [x] 5. Implementar endpoints de cadastro de coletoras






- [x] 5.1 Criar service de coletoras (services/coletorasService.js)

  - Implementar função criar() para inserir coletora no banco
  - Implementar função listarGoias() para buscar coletoras com UF = "GO"
  - Adicionar tratamento de erros de banco de dados
  - _Requirements: 3.1, 5.1, 5.2_

- [x] 5.2 Criar controller de coletoras (controllers/coletorasController.js)


  - Implementar criarColetora() com validação de campos obrigatórios incluindo licenca_goias
  - Implementar validação de UF = "GO"
  - Implementar listarColetorasGoias()
  - Adicionar tratamento de erro de CNPJ duplicado
  - _Requirements: 3.1, 3.2, 5.1, 5.2_

- [x] 5.3 Criar rotas de coletoras (routes/coletoras.js)


  - Definir POST /coletoras
  - Definir GET /coletoras-goias
  - Conectar rotas aos controllers
  - _Requirements: 3.1, 5.1_

- [x] 6. Implementar endpoints de gerenciamento de solicitações






- [x] 6.1 Criar service de solicitações (services/solicitacoesService.js)

  - Implementar função criar() que define status "Pendente" e data atual automaticamente
  - Implementar função buscarPorIndustria() para histórico de uma indústria
  - Implementar função buscarPendentes() com JOIN para incluir nome da indústria
  - Implementar função aceitar() que valida status "Pendente" e atualiza para "Aceita"
  - Implementar função concluir() que valida status "Aceita" e atualiza para "Concluída"
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 8.1, 9.1, 9.3, 10.1_


- [x] 6.2 Criar controller de solicitações (controllers/solicitacoesController.js)

  - Implementar criarSolicitacao() com validação de industriaId, residuo e quantidade_kg
  - Implementar listarPorIndustria() que recebe ID via parâmetro de rota
  - Implementar listarPendentes()
  - Implementar aceitarSolicitacao() que valida status atual
  - Implementar concluirSolicitacao() que chama service de certificados
  - _Requirements: 6.1, 6.5, 7.1, 8.1, 9.1, 9.4, 10.1, 10.5_


- [x] 6.3 Criar rotas de solicitações (routes/solicitacoes.js)






  - Definir POST /solicitacoes
  - Definir GET /solicitacoes/industria/:id
  - Definir GET /solicitacoes/pendentes
  - Definir PUT /solicitacoes/:id/aceitar
  - Definir POST /solicitacoes/:id/concluir
  - Conectar rotas aos controllers
  - _Requirements: 6.1, 7.1, 8.1, 9.1, 10.1_
-

- [x] 7. Implementar endpoints de certificados





- [x] 7.1 Criar service de certificados (services/certificadosService.js)

  - Implementar função criar() que gera hash único usando hashGenerator
  - Implementar função buscarPorIndustria() com JOINs para incluir dados da coletora e solicitação
  - Adicionar validação de solicitacaoId único
  - _Requirements: 10.2, 10.3, 10.4, 11.1, 11.2_

- [x] 7.2 Criar controller de certificados (controllers/certificadosController.js)


  - Implementar listarPorIndustria() que recebe ID via parâmetro de rota
  - Formatar resposta incluindo hashVerificacao, dados da coletora e detalhes da solicitação
  - _Requirements: 11.1, 11.2, 11.5_

- [x] 7.3 Criar rotas de certificados (routes/certificados.js)


  - Definir GET /certificados/industria/:id
  - Conectar rota ao controller
  - _Requirements: 11.1_

- [x] 8. Configurar servidor Express e middleware





  - Configurar CORS para permitir requisições do frontend
  - Adicionar middleware express.json() para parsing de JSON
  - Registrar todas as rotas no server.js
  - Configurar porta do servidor (3000)
  - Adicionar logs de inicialização
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 9. Criar estrutura inicial do frontend





  - Criar diretório `frontend/` com subpastas js/ e css/
  - Criar arquivo index.html com menu de navegação para os três perfis
  - Criar arquivo js/api.js com funções auxiliares (apiGet, apiPost, apiPut)
  - Definir constante API_BASE_URL apontando para http://localhost:3000
  - _Requirements: 13.1, 14.4_

- [x] 10. Implementar página de cadastro (cadastro.html)






- [x] 10.1 Criar estrutura HTML com TailwindCSS via CDN

  - Adicionar link do TailwindCSS CDN no head
  - Criar layout com dois cards: um para indústrias e outro para coletoras
  - Aplicar classes do Tailwind para estilização consistente
  - _Requirements: 13.1, 13.2, 14.1_


- [x] 10.2 Implementar formulário de cadastro de indústrias

  - Criar campos: nome, cnpj, cep, endereco, bairro, cidade, uf
  - Adicionar evento onblur no campo CEP para integração com ViaCEP
  - Implementar função buscarCEP() que consulta ViaCEP API
  - Implementar validação de UF = "GO" com alert de erro
  - Implementar preenchimento automático de endereco, bairro, cidade, uf
  - Adicionar botão "Salvar Indústria" que chama POST /industrias
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 14.1_



- [x] 10.3 Implementar formulário de cadastro de coletoras

  - Criar campos: nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf
  - Reutilizar lógica de buscarCEP() com validação de UF = "GO"
  - Adicionar botão "Salvar Coletora" que chama POST /coletoras
  - Implementar tratamento de erros e mensagens de sucesso
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 14.1_




- [x] 10.4 Criar arquivo js/cadastro.js com toda a lógica

  - Implementar buscarCEP() com fetch para ViaCEP
  - Implementar cadastrarIndustria() com fetch para API
  - Implementar cadastrarColetora() com fetch para API
  - Adicionar validações de campos obrigatórios
  - Adicionar tratamento de erros com try-catch e mensagens amigáveis
  - Adicionar comentários extensivos em português
  - _Requirements: 1.1, 1.2, 1.3, 14.5_

- [x] 11. Implementar dashboard da indústria (industria.html)



- [x] 11.1 Criar estrutura HTML com três seções


  - Seção 1: Formulário de solicitação de coleta
  - Seção 2: Tabela de histórico de solicitações
  - Seção 3: Tabela de certificados
  - Aplicar TailwindCSS para layout responsivo
  - _Requirements: 13.2, 14.2_

- [x] 11.2 Implementar formulário de solicitação de coleta

  - Criar select de indústrias populado via GET /industrias
  - Criar campos: residuo (tipo de resíduo) e quantidade_kg
  - Adicionar botão "Solicitar Coleta" que chama POST /solicitacoes
  - Implementar função carregarIndustrias() executada no load da página
  - _Requirements: 4.3, 6.1, 6.5, 14.2_


- [x] 11.3 Implementar tabela de histórico de solicitações
  - Criar tabela com colunas: ID, Data, Resíduo, Quantidade (kg), Status
  - Implementar função carregarSolicitacoes() que chama GET /solicitacoes/industria/:id
  - Formatar data para exibição legível
  - Aplicar cores diferentes para cada status (Pendente, Aceita, Concluída)
  - _Requirements: 7.1, 7.4, 14.2_


- [x] 11.4 Implementar tabela de certificados
  - Criar tabela com colunas: ID, Data Emissão, Coletora, Resíduo, Quantidade (kg), Hash
  - Implementar função carregarCertificados() que chama GET /certificados/industria/:id
  - Destacar visualmente o hash de verificação
  - Formatar data para exibição legível
  - _Requirements: 11.1, 11.4, 11.5, 14.2_


- [x] 11.5 Criar arquivo js/industria.js com toda a lógica


  - Implementar carregarIndustrias() com fetch
  - Implementar criarSolicitacao() com validações
  - Implementar carregarSolicitacoes() com atualização da tabela
  - Implementar carregarCertificados() com atualização da tabela
  - Adicionar função init() que carrega dados ao abrir a página
  - Adicionar comentários extensivos em português
  - _Requirements: 1.1, 1.2, 1.3, 14.4, 14.5_

- [x] 12. Implementar dashboard da coletora (coletora.html)





- [x] 12.1 Criar estrutura HTML com duas seções


  - Seção 1: Tabela de coletas pendentes
  - Seção 2: Tabela de coletas aceitas
  - Aplicar TailwindCSS para layout consistente
  - _Requirements: 13.2, 14.3_


- [x] 12.2 Implementar tabela de coletas pendentes

  - Criar tabela com colunas: ID, Indústria, Data, Resíduo, Quantidade (kg), Ação
  - Adicionar botão "Aceitar" em cada linha
  - Implementar função carregarPendentes() que chama GET /solicitacoes/pendentes
  - Implementar função aceitarSolicitacao() que chama PUT /solicitacoes/:id/aceitar
  - Atualizar tabela após aceitar solicitação
  - _Requirements: 8.1, 8.4, 9.1, 9.4, 9.5, 14.3_


- [x] 12.3 Implementar tabela de coletas aceitas


  - Criar tabela com colunas: ID, Indústria, Data, Resíduo, Quantidade (kg), Ação
  - Adicionar botão "Finalizar Coleta" em cada linha com select de coletora
  - Implementar função carregarAceitas() que filtra solicitações com status "Aceita"
  - Implementar função concluirColeta() que chama POST /solicitacoes/:id/concluir
  - Atualizar ambas as tabelas após concluir coleta
  - _Requirements: 10.1, 10.5, 14.3_




- [x] 12.4 Criar arquivo js/coletora.js com toda a lógica


  - Implementar carregarPendentes() com fetch e atualização da tabela
  - Implementar carregarAceitas() com fetch e atualização da tabela
  - Implementar aceitarSolicitacao() com confirmação
  - Implementar concluirColeta() com seleção de coletora e confirmação
  - Adicionar função init() que carrega dados ao abrir a página
  - Adicionar comentários extensivos em português
  - _Requirements: 1.1, 1.2, 1.3, 14.4, 14.5_

- [x] 13. Criar página inicial de navegação (index.html)





  - Criar layout com TailwindCSS
  - Adicionar título e descrição do sistema
  - Criar três cards com links para: cadastro.html, industria.html, coletora.html
  - Adicionar ícones ou badges para cada perfil
  - Aplicar estilização consistente com o resto do sistema
  - _Requirements: 13.2, 14.1, 14.2, 14.3_

- [ ]* 14. Adicionar validações e melhorias de UX
  - Implementar loading states (desabilitar botões durante requisições)
  - Adicionar spinners ou indicadores de carregamento
  - Implementar validação de formato de CNPJ no frontend
  - Adicionar máscaras para campos CEP e CNPJ
  - Melhorar feedback visual de sucesso/erro (substituir alerts por toasts)
  - _Requirements: 14.5_

- [x] 15. Criar documentação do projeto






  - Criar README.md com instruções de instalação
  - Documentar como executar o backend (npm install, npm start)
  - Documentar como abrir o frontend (abrir index.html no navegador)
  - Listar todas as dependências e versões
  - Adicionar exemplos de uso da API
  - Incluir screenshots das páginas
  - _Requirements: 1.1_

- [ ]* 16. Adicionar arquivo CSS customizado (opcional)
  - Criar frontend/css/custom.css
  - Adicionar estilos complementares ao TailwindCSS
  - Definir variáveis CSS para cores do tema
  - Adicionar animações suaves para transições
  - _Requirements: 13.2_
