# nodejs-simple-API

Esta é uma API simples desenvolvida com NodeJS que permite o registro e login de usuários; e as operações CRUD para gerenciar ferramentas (tools).

## Funcionalidades

- **Registro de Usuário**: Registre-se através do endpoint `/api/register`;
- **Login de Usuário**: Faça login através do endpoint `/api/login`;
- **Gerenciamento de Tools**:
  - Criar e ler ferramentas pelo endpoint `/api/tools`;
  - Ler, atualizar e deletar ferramentas específicas pelo endpoint `/api/tools/{toolId}`;

## Documentação

A documentação completa da API pode ser acessada pelo endpoint `/api-docs`.

## Como Rodar a aplicação

### 1. Clonar o repositório

Usando SSH (recomendado):

```bash
git clone git@github.com:dersh0w/nodejs-simple-API.git
```

Usando HTTPS:

```bash
git clone https://github.com/dersh0w/nodejs-simple-API.git
```

### 2. Pré-requisitos

Antes de rodar a aplicação, crie um arquivo `.env` na raiz do projeto com as informações contidas no arquivo `.env.example` que melhor sirva suas necessidades.

### 3. Rodar a aplicação

**Ambiente de Desenvolvimento**

Para iniciar a aplicação em um ambiente de desenvolvimento, utilize o seguinte comando:

```bash
docker compose -f docker-compose.dev.yaml up --build
```

**Ambiente de Produção**

Para iniciar a aplicação em um ambiente de produção, utilize o seguinte comando:

```bash
docker compose -f docker-compose.prod.yaml up --build
```

## Tecnologias Usadas

- **Node.JS**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT**
- **Validator e Joi (validação)**
- **Morgan e Winston (loggers)**
- **Swagger UI/OpenAPI (documentação)**
- **express-mongo-sanitize, express-rate-limit e helmet (proteção)**
- **Docker**
