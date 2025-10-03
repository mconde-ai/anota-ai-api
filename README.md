# API do Desafio Anota AI 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmconde-ai%2Fanota-ai-api)

API desenvolvida como solução para o desafio técnico da Anota AI. O projeto consiste em um sistema para contagem de acessos e gerenciamento de usuários, construído com foco em boas práticas, escalabilidade, segurança e observabilidade.

> **API em produção:** [https://anota-ai-api.vercel.app/api/docs](https://anota-ai-api.vercel.app/api/docs)

## ✨ Funcionalidades

- ✅ **Health Check:**
  - `GET /`: Endpoint de verificação de saúde que monitora a conectividade com o banco de dados. Retorna status `200` se a API estiver saudável.
- ✅ **Contador de Acessos:**
  - `POST /analytics/increment`: Rota para incrementar o contador de acessos (utilizando operações atômicas para evitar condições de corrida).
  - `GET /analytics/count`: Rota para consultar o número total de acessos.
- ✅ **Gerenciamento de Usuários (CRUD Completo):**
  - `POST /users`: Rota para criar um novo usuário com validação de dados e senha criptografada.
  - `GET /users`: Rota para listar todos os usuários.
  - `GET /users/:id`: Rota para visualizar um usuário específico.
  - `PATCH /users/:id`: Rota para atualizar parcialmente um usuário.
  - `DELETE /users/:id`: Rota para remover um usuário.
- ✨ **Bônus Implementados:**
  - **Testes Automatizados:** Suíte de testes de ponta a ponta (E2E) com Jest e Supertest.
  - **Documentação Interativa:** Documentação gerada automaticamente com Swagger (OpenAPI).
  - **Deploy Contínuo:** Implantação automatizada na Vercel a cada push na branch `main`.
  - **Qualidade de Código:** Uso de `husky` e `commitlint` para garantir o padrão de *Conventional Commits*.

## 🛠️ Tecnologias Utilizadas

- **Backend:**
  - **Node.js**
  - **TypeScript**
  - **NestJS:** Framework progressivo para aplicações eficientes e escaláveis.
  - **Terminus:** Para implementação de Health Checks.
- **Banco de Dados:**
  - **MongoDB:** Banco de dados NoSQL orientado a documentos.
  - **Mongoose:** ODM para modelagem e validação de dados.
  - **Docker:** Para rodar o ambiente de banco de dados localmente.
- **Qualidade e Testes:**
  - **Jest:** Framework de testes para JavaScript.
  - **Supertest:** Biblioteca para testes de ponta a ponta de APIs HTTP.
  - **ESLint & Prettier:** Para padronização e qualidade do código.
- **Deploy:**
  - **Vercel:** Plataforma de implantação serverless.
  - **MongoDB Atlas:** Serviço de banco de dados MongoDB na nuvem para produção.

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para rodar a aplicação no seu ambiente de desenvolvimento.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/mconde-ai/anota-ai-api.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd anota-ai-api
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    - Crie uma cópia do arquivo de exemplo:
      ```bash
      cp .env.example .env
      ```

5.  **Inicie o banco de dados com Docker:**
    - Verifique se o Docker Desktop está em execução.
    - Execute o comando:
      ```bash
      docker-compose up -d
      ```

6.  **Inicie a aplicação:**
    ```bash
    npm run start:dev
    ```

A aplicação estará disponível em `http://localhost:3000`.

## 📚 Documentação da API

Após iniciar a aplicação, a documentação completa e interativa do Swagger (OpenAPI) estará disponível em:

**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

## 🧪 Rodando os Testes

Para garantir a qualidade e a integridade da aplicação, execute os testes automatizados:

- **Para rodar todos os testes de ponta a ponta (E2E):**
  ```bash
  npm run test:e2e
  ```