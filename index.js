require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const { Op } = require('sequelize');
const connection = require('./database/database');
const { requireAdmin, requireChefe } = require('./middlewares/auth');
const fs = require('fs');

// ─── ROUTERS ──────────────────────────────────────────────────────
const eventosController = require('./eventos/EventosController');
const parceirosController = require('./parceiros/ParceirosController');

// ─── MODELS ───────────────────────────────────────────────────────
const Evento = require('./eventos/Evento');
const Parceiro = require('./parceiros/Parceiro');

// ─── VIEW ENGINE ──────────────────────────────────────────────────
app.set('view engine', 'ejs');

// ─── ARQUIVOS ESTÁTICOS ───────────────────────────────────────────
app.use(express.static('public'));

// ─── BODY PARSER ──────────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ─── SESSÃO ───────────────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'escoteiros-minuano-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 horas
}));

// ─── DIRETÓRIOS DE UPLOAD ─────────────────────────────────────────
['public/imgs/eventos', 'public/imgs/parceiros', 'public/imgs/ramos'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── CONEXÃO COM O BANCO ──────────────────────────────────────────
connection.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados realizada!');
        return connection.sync({ alter: false });
    })
    .catch(err => console.error('Erro ao conectar ao banco:', err));

// ─── ROTAS PÚBLICAS ───────────────────────────────────────────────
app.get('/', async (req, res) => {
    try {
        const fotos = await Evento.findAll({
            where: {
                tipo: 'agenda',
                imagem: { [Op.ne]: null }
            },
            order: [['data', 'DESC']],
            limit: 8
        });
        res.render('index', { fotos });
    } catch (err) {
        console.error(err);
        res.render('index', { fotos: [] });
    }
});
app.get('/contato', (req, res) => res.render('contato'));
app.get('/quem-somos', (req, res) => res.render('quem-somos'));
app.get('/escotismo', (req, res) => res.render('escotismo'));
app.get('/ramos', (req, res) => res.render('ramos'));
app.get('/downloads', (req, res) => res.render('downloads'));

// Galeria: todos os eventos da Agenda que têm imagem
app.get('/galeria', async (req, res) => {
    try {
        const fotos = await Evento.findAll({
            where: {
                tipo: 'agenda',
                imagem: { [Op.ne]: null }
            },
            order: [['data', 'DESC']]
        });
        res.render('galeria', { fotos });
    } catch (err) {
        console.error(err);
        res.render('galeria', { fotos: [] });
    }
});

app.use('/', eventosController);
app.use('/', parceirosController);

// ─── ROTAS DE LOGIN ───────────────────────────────────────────────
app.get('/admin/login', (req, res) => {
    if (req.session && (req.session.adminLogado || req.session.chefeLogado)) {
        return res.redirect('/admin/eventos');
    }
    res.render('admin/login', { erro: null });
});

app.post('/admin/login', (req, res) => {
    const { usuario, senha } = req.body;

    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
    const CHEFE_USER = process.env.CHEFE_USER || 'chefe';
    const CHEFE_PASS = process.env.CHEFE_PASS || 'chefe123';

    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
        req.session.adminLogado = true;
        req.session.chefeLogado = false;
        return res.redirect('/admin/eventos');
    }

    if (usuario === CHEFE_USER && senha === CHEFE_PASS) {
        req.session.chefeLogado = true;
        req.session.adminLogado = false;
        return res.redirect('/admin/eventos');
    }

    res.render('admin/login', { erro: 'Usuário ou senha incorretos.' });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});

// ─── SERVIDOR ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
