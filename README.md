# 71º Grupo de Escoteiros Minuano — Portal Web

Portal Node.js para o 71º Grupo de Escoteiros Minuano, desenvolvido com Express, EJS e Sequelize (MySQL).

## Estrutura do Projeto

```
escoteiros/
├── index.js                    # Servidor principal
├── package.json
├── .env.example                # Copie para .env e preencha
│
├── database/
│   └── database.js             # Conexão Sequelize / MySQL
│
├── middlewares/
│   └── auth.js                 # requireAdmin | requireChefe
│
├── eventos/
│   ├── Evento.js               # Model (agenda / calendário)
│   └── EventosController.js    # Rotas públicas e admin
│
├── parceiros/
│   ├── Parceiro.js             # Model (empresas amigas)
│   └── ParceirosController.js  # Rotas públicas e admin
│
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   ├── index.ejs               # Home
│   ├── quem-somos.ejs
│   ├── escotismo.ejs
│   ├── ramos.ejs
│   ├── agenda.ejs              # Eventos mensais (público)
│   ├── calendario.ejs          # Calendário anual (público)
│   ├── parceiros.ejs           # Empresas amigas (público)
│   ├── contato.ejs
│   └── admin/
│       ├── login.ejs
│       ├── eventos.ejs         # Listar eventos
│       ├── novoevento.ejs      # Cadastrar evento
│       ├── parceiros.ejs       # Listar parceiros
│       └── novoparceiro.ejs    # Cadastrar parceiro
│
└── public/
    ├── style.css               # CSS global (padrão do projeto)
    └── imgs/
        ├── eventos/            # Imagens de eventos (gerado automaticamente)
        └── parceiros/          # Logos dos parceiros (gerado automaticamente)
```

## Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com seus dados de banco e credenciais
```

Conteúdo do `.env`:
```
DB_USER=root
DB_PASS=suasenha
DB_NAME=escoteiros
DB_HOST=localhost

SESSION_SECRET=chave-secreta-longa-aqui

ADMIN_USER=admin
ADMIN_PASS=senha-do-admin
CHEFE_USER=chefe
CHEFE_PASS=senha-do-chefe
```

### 3. Criar banco de dados MySQL
```sql
CREATE DATABASE escoteiros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Iniciar o servidor
```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

O servidor sobe em `http://localhost:8080`

---

## Rotas

### Públicas
| Rota | Descrição |
|------|-----------|
| `GET /` | Home |
| `GET /quem-somos` | Quem Somos (estática) |
| `GET /escotismo` | Escotismo (estática) |
| `GET /ramos` | Ramos (estática) |
| `GET /agenda` | Agenda mensal de eventos |
| `GET /calendario` | Calendário anual |
| `GET /parceiros` | Empresas Amigas |
| `GET /contato` | Página de contato |

### Área Restrita (Chefe ou Admin)
| Rota | Descrição |
|------|-----------|
| `GET /admin/login` | Tela de login |
| `GET /admin/eventos` | Listar eventos |
| `GET /admin/eventos/novo` | Formulário novo evento |
| `POST /admin/eventos/salvar` | Salvar evento |
| `POST /admin/eventos/deletar` | Deletar evento |
| `GET /admin/parceiros` | Listar parceiros |
| `GET /admin/parceiros/novo` | Formulário novo parceiro |
| `POST /admin/parceiros/salvar` | Salvar parceiro |
| `POST /admin/parceiros/deletar` | Deletar parceiro |
| `GET /admin/logout` | Encerrar sessão |

---

## Funcionalidades implementadas

### Agendamento de Eventos (doc)
- **Agenda** (`tipo: 'agenda'`): eventos mensais, com descrição, horário, local e **imagem**.
- **Calendário** (`tipo: 'calendario'`): visão anual, sem imagem, agrupados por mês.
- Admin pode cadastrar, listar e deletar eventos.
- Upload de imagem via Multer (salvo em `public/imgs/eventos/`).

### Empresas Amigas / Parceiros
- Cadastro de nome, logomarca, descrição, rede social e link.
- Exibição em grid público (`/parceiros`).
- Gestão completa pelo admin.

### Controle de Acesso (doc)
- **Administrador**: acesso total.
- **Chefe**: acesso a eventos e parceiros (sem gerenciar usuários).
- Redirecionamento automático para `/admin/login` se não autenticado.

---

## Tecnologias
- **Node.js** + **Express 5**
- **EJS** (view engine)
- **Sequelize** + **MySQL 5.7** (compatível com hospedagem LocalWeb)
- **Multer** (upload de imagens)
- **express-session** (autenticação por sessão)
- **dotenv** (variáveis de ambiente)
"# escoteiros" 
