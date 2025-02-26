# Rural Producers API

API para gerenciamento de produtores rurais com Repository Pattern, IoC e DI.

## Tecnologias

- Node.js
- TypeScript
- TypeORM
- Postgres
- Docker
- Jest
- Yup
- Winston

## Como Executar

Siga os passos abaixo para configurar e executar a aplicação localmente:

### 1. Clone o repositório:

```bash
git clone <repo-url>
cd rural-producers-api
```

### 2. Configurar Variáveis de Ambiente

- Crie um arquivo `.env` na raiz do projeto.
- Preencha as variáveis de ambiente conforme o exemplo fornecido em `.env.example`. Exemplo:

### 3. Instalar Dependências

- Execute o comando abaixo para instalar todas as dependências do projeto:

```bash
npm install
```

### 4. Subir o container Docker

- Execute o comando abaixo para subir o container docker localmente:

```bash
docker compose up -d
```

### 5. Executar migration

- Execute o comando abaixo para executar a migration existente:

```bash
npm run migration:run
```

### 6. Iniciar a aplicação

- Execute o comando abaixo para iniciar a aplicação:

```bash
npm run start
```

## 7. Executar testes unitários

Siga os passos abaixo para executar os testes unitários da aplicação:

```bash
npm run test
```
