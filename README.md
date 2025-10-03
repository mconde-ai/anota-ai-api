# API do Desafio Anota AI 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)
<!--
  TODO: Adicione o badge de deploy do Vercel aqui.
  Você pode obtê-lo no dashboard do seu projeto no Vercel.
  Exemplo: [![Vercel Status](https://vercel.com/_/button?sql_project=...)]
-->

API desenvolvida como solução para o desafio técnico da Anota AI. O projeto consiste em um sistema para contagem de acessos e gerenciamento de usuários, construído com foco em boas práticas, escalabilidade e segurança.

> **API em produção:** [https://anota-ai-api.vercel.app/api/docs](https://anota-ai-api.vercel.app/api/docs)
> *(Substitua pelo link real do seu deploy no Vercel)*

## ✨ Funcionalidades

- ✅ **Contador de Acessos:**
  - `POST /analytics/increment`: Rota para incrementar o contador de acessos (utilizando operações atômicas para evitar condições de corrida).
  - `GET /analytics/count`: Rota para consultar o número total de acessos.
- ✅ **Gerenciamento de Usuários:**
  - `POST /users`: Rota para criar um novo usuário com validação de dados e senha criptografada com `bcrypt`.
  - `GET /users/:id`: Rota para visualizar as informações de um usuário específico (sem expor a senha).
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
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
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
    - O arquivo `.env` já virá configurado para o ambiente Docker local.

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
*(Você pode criar um arquivo LICENSE se quiser, ou remover esta linha)*