# Requirements Document

## Introduction

O Sistema de Gerenciamento de Coleta Seletiva Industrial é uma aplicação full-stack desenvolvida para atender aos requisitos da APS de Ciência da Computação, demonstrando o uso de Web Services (API RESTful) e uma aplicação consumidora (Frontend). O sistema facilita o gerenciamento de coleta de resíduos industriais em conformidade com a ISO 14.000, focando especificamente em empresas localizadas no estado de Goiás.

O sistema conecta indústrias que precisam descartar resíduos com empresas coletoras licenciadas, gerando certificados de destinação final para fins de auditoria ambiental.

## Glossary

- **Sistema**: O Sistema de Gerenciamento de Coleta Seletiva Industrial completo (backend + frontend)
- **API**: O backend RESTful desenvolvido em Node.js com Express.js
- **Frontend**: A aplicação web consumidora desenvolvida em HTML5, TailwindCSS e JavaScript
- **Indústria**: Empresa geradora de resíduos industriais que necessita de coleta
- **Coletora**: Empresa licenciada para coletar e destinar resíduos industriais
- **Solicitação**: Pedido de coleta de resíduo criado por uma indústria
- **Certificado**: Documento digital que comprova a destinação final adequada do resíduo
- **ViaCEP API**: Serviço público externo para consulta de endereços por CEP
- **Status Pendente**: Solicitação criada mas ainda não aceita por nenhuma coletora
- **Status Aceita**: Solicitação aceita por uma coletora mas ainda não concluída
- **Status Concluída**: Solicitação finalizada com certificado emitido
- **Hash de Verificação**: Código único gerado para validar a autenticidade do certificado

## Requirements

### Requirement 1

**User Story:** Como desenvolvedor do sistema, eu quero que todo o código seja extensivamente comentado, para que todos os membros do grupo possam entender o projeto facilmente.

#### Acceptance Criteria

1. THE Sistema SHALL include detailed comments explaining the purpose of each function in both backend and frontend code
2. THE Sistema SHALL include comments explaining the logic of each API endpoint
3. THE Sistema SHALL include comments explaining the purpose of frontend functions and API consumption logic
4. THE Sistema SHALL use Portuguese language for all code comments to facilitate team understanding

### Requirement 2

**User Story:** Como administrador do sistema, eu quero cadastrar novas indústrias no banco de dados, para que elas possam solicitar coletas de resíduos.

#### Acceptance Criteria

1. WHEN a POST request is sent to /industrias endpoint, THE API SHALL store a new industry record with fields: id, nome, cnpj, cep, endereco, bairro, cidade, uf
2. WHEN the industry registration form is submitted, THE Frontend SHALL validate that all required fields are filled
3. WHEN a CEP is entered in the registration form, THE Frontend SHALL automatically fetch address data from ViaCEP API
4. IF the uf returned by ViaCEP API is not "GO", THEN THE Frontend SHALL display an error alert and prevent registration
5. WHEN address data is successfully fetched from ViaCEP, THE Frontend SHALL auto-populate endereco, bairro, cidade, and uf fields

### Requirement 3

**User Story:** Como administrador do sistema, eu quero cadastrar novas empresas coletoras no banco de dados, para que elas possam aceitar solicitações de coleta.

#### Acceptance Criteria

1. WHEN a POST request is sent to /coletoras endpoint, THE API SHALL store a new collector company record with fields: id, nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf
2. WHEN the collector registration form is submitted, THE Frontend SHALL validate that all required fields are filled including licenca_goias
3. WHEN a CEP is entered in the collector registration form, THE Frontend SHALL automatically fetch address data from ViaCEP API
4. IF the uf returned by ViaCEP API is not "GO", THEN THE Frontend SHALL display an error alert and prevent registration
5. WHEN address data is successfully fetched from ViaCEP, THE Frontend SHALL auto-populate endereco, bairro, cidade, and uf fields

### Requirement 4

**User Story:** Como gestor de uma indústria, eu quero visualizar todas as indústrias cadastradas, para que eu possa selecionar minha empresa ao fazer uma solicitação.

#### Acceptance Criteria

1. WHEN a GET request is sent to /industrias endpoint, THE API SHALL return a list of all registered industries
2. THE API SHALL return industry data in JSON format with all fields: id, nome, cnpj, cep, endereco, bairro, cidade, uf
3. WHEN the industry solicitation page loads, THE Frontend SHALL populate a select dropdown with data from GET /industrias endpoint

### Requirement 5

**User Story:** Como gestor de uma indústria, eu quero visualizar todas as empresas coletoras licenciadas em Goiás, para que eu possa conhecer as opções disponíveis para coleta.

#### Acceptance Criteria

1. WHEN a GET request is sent to /coletoras-goias endpoint, THE API SHALL return a list of all collector companies licensed in Goiás state
2. THE API SHALL filter results to include only companies where uf equals "GO"
3. THE API SHALL return collector data in JSON format with all fields: id, nome, cnpj, licenca_goias, cep, endereco, bairro, cidade, uf

### Requirement 6

**User Story:** Como gestor de uma indústria, eu quero criar uma solicitação de coleta de resíduos, para que uma empresa coletora possa retirar os resíduos da minha empresa.

#### Acceptance Criteria

1. WHEN a POST request is sent to /solicitacoes endpoint with industriaId, residuo, and quantidade_kg, THE API SHALL create a new collection request record
2. WHEN a new collection request is created, THE API SHALL automatically set status to "Pendente"
3. WHEN a new collection request is created, THE API SHALL automatically set data to the current date
4. THE API SHALL store the collection request with fields: id, industriaId, data, status, residuo, quantidade_kg
5. WHEN the solicitation form is submitted, THE Frontend SHALL send a POST request to /solicitacoes with the selected industry, waste type, and quantity

### Requirement 7

**User Story:** Como gestor de uma indústria, eu quero visualizar o histórico de todas as minhas solicitações de coleta, para que eu possa acompanhar o status de cada pedido.

#### Acceptance Criteria

1. WHEN a GET request is sent to /solicitacoes/industria/:id endpoint, THE API SHALL return all collection requests for the specified industry
2. THE API SHALL return requests ordered by date in descending order (most recent first)
3. THE API SHALL include all request fields: id, industriaId, data, status, residuo, quantidade_kg
4. WHEN the industry dashboard loads, THE Frontend SHALL display a table with all requests from GET /solicitacoes/industria/:id endpoint

### Requirement 8

**User Story:** Como operador de uma empresa coletora, eu quero visualizar todas as solicitações pendentes, para que eu possa escolher quais coletas aceitar.

#### Acceptance Criteria

1. WHEN a GET request is sent to /solicitacoes/pendentes endpoint, THE API SHALL return all collection requests with status "Pendente"
2. THE API SHALL include industry information in the response for each request
3. THE API SHALL return requests ordered by date in ascending order (oldest first)
4. WHEN the collector dashboard loads, THE Frontend SHALL display a table with all pending requests from GET /solicitacoes/pendentes endpoint

### Requirement 9

**User Story:** Como operador de uma empresa coletora, eu quero aceitar uma solicitação de coleta pendente, para que a indústria saiba que vou realizar a coleta.

#### Acceptance Criteria

1. WHEN a PUT request is sent to /solicitacoes/:id/aceitar endpoint, THE API SHALL update the request status from "Pendente" to "Aceita"
2. THE API SHALL validate that the request exists before updating
3. THE API SHALL validate that the current status is "Pendente" before allowing the update
4. WHEN the accept button is clicked in the frontend, THE Frontend SHALL send a PUT request to /solicitacoes/:id/aceitar
5. WHEN the request is successfully accepted, THE Frontend SHALL refresh the pending requests table

### Requirement 10

**User Story:** Como operador de uma empresa coletora, eu quero finalizar uma coleta aceita, para que seja gerado um certificado de destinação final.

#### Acceptance Criteria

1. WHEN a POST request is sent to /solicitacoes/:id/concluir endpoint, THE API SHALL update the request status from "Aceita" to "Concluída"
2. WHEN a collection request is marked as completed, THE API SHALL automatically create a new certificate record in the Certificado table
3. THE API SHALL generate a unique hashVerificacao for the certificate
4. THE API SHALL store the certificate with fields: id, solicitacaoId, coletoraId, dataEmissao, hashVerificacao
5. WHEN the finalize button is clicked in the frontend, THE Frontend SHALL send a POST request to /solicitacoes/:id/concluir
6. WHEN the collection is successfully completed, THE Frontend SHALL refresh the accepted requests table

### Requirement 11

**User Story:** Como gestor de uma indústria, eu quero visualizar todos os certificados de destinação final emitidos para minha empresa, para que eu possa apresentá-los em auditorias ISO 14.000.

#### Acceptance Criteria

1. WHEN a GET request is sent to /certificados/industria/:id endpoint, THE API SHALL return all certificates for collection requests from the specified industry
2. THE API SHALL include collection request details and collector information in the certificate response
3. THE API SHALL return certificates ordered by dataEmissao in descending order (most recent first)
4. WHEN the industry dashboard loads, THE Frontend SHALL display a table with all certificates from GET /certificados/industria/:id endpoint
5. THE Frontend SHALL display the hashVerificacao for each certificate to enable verification

### Requirement 12

**User Story:** Como desenvolvedor do sistema, eu quero usar SQLite como banco de dados, para simplificar o desenvolvimento e deployment sem necessidade de servidor de banco de dados separado.

#### Acceptance Criteria

1. THE API SHALL use SQLite as the database engine
2. THE API SHALL store all data in a single database file
3. THE API SHALL create database tables for Industria, Coletora, Solicitacao, and Certificado entities
4. WHEN the API starts for the first time, THE API SHALL automatically create all required tables if they do not exist

### Requirement 13

**User Story:** Como desenvolvedor do sistema, eu quero que o frontend use TailwindCSS via CDN, para estilizar a interface sem necessidade de build process.

#### Acceptance Criteria

1. THE Frontend SHALL include TailwindCSS via CDN link in all HTML pages
2. THE Frontend SHALL use TailwindCSS utility classes for all styling
3. THE Frontend SHALL maintain a consistent visual design across all pages using TailwindCSS components

### Requirement 14

**User Story:** Como usuário do sistema, eu quero acessar diferentes páginas para cada perfil (Cadastro, Indústria, Coletora), para que eu possa realizar as operações específicas de cada função.

#### Acceptance Criteria

1. THE Frontend SHALL provide a cadastro.html page with forms for registering industries and collectors
2. THE Frontend SHALL provide an industria.html page with forms for creating requests and viewing history
3. THE Frontend SHALL provide a coletora.html page with tables for managing pending and accepted collections
4. THE Frontend SHALL use vanilla JavaScript with fetch API to consume all backend endpoints
5. THE Frontend SHALL handle API errors gracefully and display user-friendly error messages
