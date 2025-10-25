# 🐾 Buscar Patas - Sistema de Adoção de Pets

Bem-vindo ao Buscar Patas, uma aplicação web completa para gerenciamento de abrigos de animais. Este projeto foi desenvolvido como parte do Bootcamp **Desenvolvimento Full Stack 2025.3**.

O objetivo principal foi modernizar o processo de adoção, substituindo controles manuais por um sistema eficiente que facilita o cadastro de pets e a conexão entre eles e seus futuros lares.

## ✨ Funcionalidades Principais

O sistema é segmentado para atender às necessidades dos diferentes tipos de usuários: Adotantes e Administradores.

### 👥 Funcionalidades para Adotantes (Role: `USER`)

-   **👤 Autenticação Segura:** Cadastro de novo usuário e Login com email/senha. *+ Opção de Login Social (Gmail).*
-   **🔍 Busca e Filtragem:** Buscar pets disponíveis por espécie, tamanho, personalidade.
-   **💖 Processo de Adoção:** Iniciar o processo de adoção de um pet diretamente pela plataforma.
-   **📈 Painel do Adotante:** Visualizar o histórico e o status das adoções realizadas.

### ⚙️ Funcionalidades para Administradores (Role: `ADMIN`)

-   **🐕 Gestão de Pets (CRUD):** Cadastrar, visualizar, atualizar e deletar pets.
-   **🤝 Gestão de Adotantes (CRUD):** Gerenciar os dados de cadastro de adotantes.
-   **📜 Gestão de Adoções (CRUD):** Registrar, atualizar e deletar registros de adoção.
-   **📊 Dashboard de Gestão:** Painel com indicadores chave para contabilização de cadastros, pets disponíveis, adoções realizadas e pets aguardando adoção.
-   **🔒 Segurança:** Sistema de autenticação baseado em JWT para proteger rotas sensíveis e administrativas.
  
## 🛠️ Tecnologias Utilizadas
Este projeto foi construído com as seguintes tecnologias:

-   **Backend:**
    -   Node.js
    -   Express.js
    -   Prisma ORM
    -   PostgreSQL
    -   JSON Web Tokens (JWT)
    -   Bcrypt.js
-   **Frontend:**
    -   ReactJS
-   **Ferramentas de Desenvolvimento:**
    -   Nodemon
    -   Insomnia (para testes de API)

## 🚀 Começando

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### Pré-requisitos

-   Node.js (versão 18.18 ou superior)
-   NPM

### Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/danieleksantos/BuscarPatas-sistema-de-adocao-de-pets.git](https://github.com/danieleksantos/BuscarPatas-sistema-de-adocao-de-pets.git)
    cd BuscarPatas-sistema-de-adocao-de-pets
    ```

2.  **Navegue até a pasta do backend:**
    ```bash
    cd backend
    ```

3.  **Crie o arquivo de ambiente:**
    Crie um arquivo chamado `.env` na pasta `backend` e adicione as strings de conexões.

    *Exemplo de `.env`:*
    ```env
    "DATABASE_URL="postgresql://buscar_patas_postgree_user:RPlf6iXzKqtxuZXslO7DXG26MObWWY82@dpg-d3sutjq4d50c73emdk1g-a.oregon-postgres.render.com/buscar_patas_postgree""
    JWT_SECRET="seu_segredo_super_secreto_pode_ser_qualquer_coisa"
    CLOUDINARY_CLOUD_NAME="seu_segredo_super_secreto_pode_ser_qualquer_coisa"
    CLOUDINARY_API_KEY="seu_segredo_super_secreto_pode_ser_qualquer_coisa"
    CLOUDINARY_API_SECRET="seu_segredo_super_secreto_pode_ser_qualquer_coisa"

    GOOGLE_CLIENT_ID="seu_segredo_super_secreto_pode_ser_qualquer_coisa"
    GOOGLE_CLIENT_SECRET="seu_segredo_super_secreto_pode_ser_qualquer_coisa"
    FRONTEND_URL="https://buscar-patas-sistema-de-adocao-de-p.vercel.app/"

    CORS_ORIGINS="http://localhost:5173,https://buscar-patas-sistema-de-adocao-de-pets-lbt1r2xw7.vercel.app,https://buscar-patas-sist*.vercel.app"
    ```

4.  **Instale as dependências:**
    ```bash
    npm install
    ```
    
5.  **Navegue até a pasta do frontend**
    ```bash
    cd frontend
    ```
6.  **Crie o arquivo de ambiente:**
    Crie um arquivo chamado `.env` na pasta `frontend` e adicione a string de conexão.

    *Seu `.env`:*
    ```env
    VITE_API_URL="https://buscarpatas-sistema-de-adocao-de-pets.onrender.com"
    ```

### ▶️ Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com reinício automático), use na pasta raiz:
```bash
npm run dev
```

## 🌐 Deploy da Aplicação

O projeto está hospedado nas seguintes plataformas:

| **Serviço** | **Plataforma** | **Link** |
| :--- | :--- | :--- |
| **Backend** | Render | [Acessar Backend](https://dashboard.render.com/web/srv-d3sv62ngi27c73dvjosg) |
| **Frontend** | Vercel | [Acessar Frontend](https://buscar-patas-sistema-de-adocao-de-p.vercel.app/) |

---

## 📚 Documentação da API

Abaixo estão os principais endpoints disponíveis na API.

> 🔒 *Rotas marcadas como `ADMIN` exigem um Bearer Token de um usuário com `role: 'ADMIN'`.*

| **Endpoint** | **Método** | **Descrição** | **Protegida?** |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Registra um novo adotante (role `USER`). | Pública |
| `/auth/login` | `POST` | Autentica um usuário e retorna um token JWT. | Pública |
| `/pets` | `GET` | Lista todos os pets com filtros (`?tamanho=...`). | Pública |
| `/pets/disponiveis` | `GET` | Lista todos os pets com status `DISPONIVEL`. | Pública |
| `/pets/adotados` | `GET` | Lista todos os pets com status `ADOTADO`. | Pública |
| `/pets` | `POST` | Cadastra um novo pet. | ADMIN |
| `/pets/bulk` | `POST` | Cadastra múltiplos pets de uma vez. | ADMIN |
| `/pets/:id` | `PATCH` | Atualiza parcialmente os dados de um pet. | ADMIN |
| `/pets/:id` | `DELETE` | Deleta um pet. | ADMIN |
| `/adotantes` | `GET` | Lista todos os adotantes. | ADMIN |
| `/adotantes` | `POST` | Cadastra um novo adotante. | ADMIN |
| `/adotantes/:id` | `PATCH` | Atualiza parcialmente um adotante. | ADMIN |
| `/adotantes/:id` | `DELETE` | Deleta um adotante. | ADMIN |
| `/adocoes` | `GET` | Lista todos os registros de adoção. | ADMIN |
| `/adocoes` | `POST` | Cria um novo registro de adoção. | ADMIN |
| `/adocoes/:id` | `PATCH` | Atualiza um registro de adoção. | ADMIN |
| `/adocoes/:id` | `DELETE` | Deleta um registro de adoção. | ADMIN |

---

## 🗺️ Modelo do Banco de Dados (DER)

Abaixo está o Diagrama de Entidade-Relacionamento que representa a estrutura do banco de dados:

![Diagrama de Entidade-Relacionamento](./frontend/src/assets/DER.png)

---

## 💡 Próximas Melhorias (Roadmap)

Temos um conjunto de melhorias planejadas para aprimorar a experiência do usuário e a funcionalidade do sistema:

- **Integração de Localização:** Implementar API de CEP para autocompletar endereços no cadastro do adotante (com opção de checkbox para CEP não localizado).
- **Atributo de Sexo do Pet:** Adicionar o atributo “Sexo” (Macho/Fêmea) ao modelo e formulários.
- **Upload de Múltiplas Fotos:** Permitir o upload de até 2 fotos por pet para melhor visualização.

**Experiência do Usuário:**
- Personalizar a saudação após o login: “Bem-vindo(a), Fulano”.
- Adicionar um formulário de contato/feedback: “Ainda com dúvidas?”.
- Comunicação do processo de adoção: envio de e-mail automático após conclusão ou atualização da adoção.

---

## 👨‍💻 Equipe Squad 2

- **Daniele Santos** — [danieleksantos](https://github.com/danieleksantos)  
- **Eduardo Schuindt** — [edudsan](https://github.com/edudsan)  
- **Patrick Santos** — [Manopk07](https://github.com/Manopk07)

---
