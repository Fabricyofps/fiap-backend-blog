# Blog Backend - Tech Challenge

## Este projeto é um backend para um blog, desenvolvido em **NestJS**, com autenticação JWT, monitoração com **Prometheus**/**Grafana**

## 🌐 Tecnologias Utilizadas

- **Node.js** + **NestJS**
- **MongoDB**
- **Docker** + **Docker Compose**
- **Prometheus** + **Grafana**
- **Swagger**

---

## ✅ Funcionalidades Principais

- CRUD de Posts
- Autenticação JWT
- Permissões por perfil (Aluno / Professor)
- Monitoramento via Prometheus/Grafana
- Documentação via Swagger

---

## 📂 Estrutura de Diretórios

```
├── src
│   ├── auth/                # Autenticação e JWT
│   ├── users/               # Serviços de usuários
│   ├── posts/               # CRUD de posts
│   ├── shared/              # Filtros, pipes, guards reutilizáveis
│   ├── app.module.ts
│   ├── main.ts              # Ponto de entrada da aplicação
├── docker-compose.yml      # Orquestração dos containers
├── Dockerfile              # Build da aplicação Node
├── .env                    # Variáveis de ambiente
├── grafanaDashboard.json   # Dashboard do Grafana para importação
```

---

## 📁 Configuração do .env

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
PORT=3010
BLOG_MONGO_URI=mongodb://mongo:27017/blog
BLOG_JWT_SECRET=sua_chave_secreta_aqui
```

---

## 🚰 Instruções para rodar com Docker Compose

### 1. Subir os containers

```bash
docker-compose up --build
```

Esse comando:

- Faz o build da aplicação
- Sobe o MongoDB
- Inicia o Prometheus, Grafana e o backend da aplicação

### 2. Acessos aos serviços

| Serviço       | URL                                                    |
| ------------- | ------------------------------------------------------ |
| API (Swagger) | [http://localhost:3010/api](http://localhost:3010/api) |
| MongoDB       | localhost:27017                                        |
| Grafana       | [http://localhost:3000](http://localhost:3000)         |
| Prometheus    | [http://localhost:9090](http://localhost:9090)         |

### 3. Configuração do Grafana

- **Login inicial**: `admin / admin`
- **Datasource**: adicione o Prometheus com a URL: `http://prometheus:9090`
- **Importar Dashboard**:
  - Clique em _"Import Dashboard"_
  - Selecione o arquivo `grafanaDashboard.json`

---

## 🔍 Swagger (Documentação de API)

Disponível em: [http://localhost:3010/api](http://localhost:3010/api)

Inclui:

- Endpoints para autenticação
- Cadastro e login de usuários
- CRUD de posts com roles

---

## 👁️ Observabilidade

### Prometheus

Coleta métricas de performance da aplicação.

### Grafana

Apresenta os dados do Prometheus em dashboards interativos.

- Host Prometheus: `http://prometheus:9090`
- Dashboard: importar `grafanaDashboard.json`

---

## ⚙️ Comandos úteis

### Instalar dependências:

```bash
npm install
```

### Rodar localmente (sem Docker):

```bash
npm run start:dev
```

### Rodar testes:

```bash
npm run test:cov
```

### Lint:

```bash
npm run lint
```

---

## 🛠 Arquivos importantes

| Arquivo                 | Descrição                                  |
| ----------------------- | ------------------------------------------ |
| `main.ts`               | Ponto de entrada da aplicação NestJS       |
| `Dockerfile`            | Docker build com etapas de build e runtime |
| `docker-compose.yml`    | Orquestra Mongo, App, Grafana e Prometheus |
| `.env.development`      | Configuração de variáveis sensíveis        |
| `grafanaDashboard.json` | Dashboard para importação no Grafana       |
| `src/shared/filters/`   | Filtros globais (como HttpExceptionFilter) |
| `src/auth/guards/`      | Guards de autenticação JWT                 |
| `src/users/`            | Registros e autenticação de usuários       |
| `src/posts/`            | CRUD de Posts                              |

---

Feito com ❤️ no Tech Challenge.
