# 🐾 Buscar Patas - Sistema de Adoção de Pets

Bem-vindo ao **Buscar Patas**, uma aplicação web completa para gerenciamento de abrigos de animais. Este projeto foi desenvolvido como parte do Bootcamp **Desenvolvimento Full Stack 2025.3**.

O objetivo principal foi modernizar o processo de adoção, substituindo controles manuais por um sistema eficiente que facilita o cadastro de pets e a conexão entre eles e seus futuros lares.

---

## ✨ Funcionalidades Principais

O sistema é segmentado para atender às necessidades dos diferentes tipos de usuários:

### 👥 Adotantes (Role: `USER`)
* **👤 Autenticação Segura:** Cadastro e Login com email/senha + Opção Google Login.
* **🔍 Busca e Filtragem:** Filtros por espécie, tamanho, personalidade e nome.
* **💖 Processo de Adoção:** Solicitação direta pela plataforma.
* **📈 Painel do Adotante:** Histórico de adoções realizadas.

### ⚙️ Administradores (Role: `ADMIN`)
* **🐕 Gestão de Pets (CRUD):** Controle total sobre os animais disponíveis.
* **🤝 Gestão de Adotantes (CRUD):** Gerenciamento de dados dos usuários.
* **📜 Gestão de Adoções (CRUD):** Registro e atualização de processos de adoção.
* **📊 Dashboard de Gestão:** Indicadores de desempenho e contagem de registros.
* **🔒 Segurança:** Autenticação via JWT para proteção de rotas administrativas.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, Bcrypt.js |
| **Frontend** | ReactJS, Bootstrap, Vite |
| **DevOps** | **Docker**, **Docker Compose (Multi-stage Build)**, Nodemon |

---

## 🚀 Como Rodar Localmente

### 🐳 Via Docker (Recomendado)
Graças à implementação de **Multi-stage Builds**, o ambiente é leve e isolado.

1.  **Subir o ambiente:**
    ```bash
    docker compose up -d --build
    ```
2.  **Configurar Banco e Seeds:**
    ```bash
    docker exec -it buscar-patas-api npx prisma migrate dev
    docker exec -it buscar-patas-api npx prisma db seed
    ```

### 💻 Instalação Manual
<details>
<summary>Clique para ver os passos manuais</summary>

1. **Clone:** `git clone https://github.com/danieleksantos/BuscarPatas-sistema-de-adocao-de-pets.git`
2. **Backend:** `cd backend && npm install && npm run start`
3. **Frontend:** `cd frontend && npm install && npm run dev`
</details>

---

## 🌐 Deploy e Acesso
* **Aplicação Live:** [Buscar Patas](https://buscar-patas-sistema-de-adocao-de-p.vercel.app/)
* **API (Render):** [Acessar Backend](https://dashboard.render.com/web/srv-d3sv62ngi27c73dvjosg)

---

## 📚 Documentação da API

> 🔒 *Rotas `ADMIN` exigem Bearer Token.*

| Endpoint | Método | Descrição | Proteção |
| :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Autentica e gera JWT | Pública |
| `/pets` | `GET` | Lista todos os pets | Pública |
| `/pets` | `POST` | Cadastra um novo pet | **ADMIN** |
| `/adotantes` | `GET` | Lista todos os adotantes | **ADMIN** |
| `/adocoes` | `POST` | Cria registro de adoção | USER |
| `/dashboard/counts` | `GET` | Indicadores do painel | **ADMIN** |


---

## DER
<p align="center">
  <img src="https://github.com/user-attachments/assets/8c571356-3475-49c0-b7ae-55bc7d08e74b" alt="DER Buscar Patas" width="400">
</p>

---

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/cfdce7bb-3924-4b43-b7d5-0f12f445504a" alt="Desktop Preview" width="500" height="1000"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/d8e7a035-3ca7-4b09-9d73-c8de394e7330" alt="Mobile preview" width="200" />
</p>


## 👨‍💻 Equipe Squad 2
* **Daniele Santos** — [@danieleksantos](https://github.com/danieleksantos)
* **Eduardo Schuindt** — [@edudsan](https://github.com/edudsan)
* **Patrick Santos** — [@Manopk07](https://github.com/Manopk07)
