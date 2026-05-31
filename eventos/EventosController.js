const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const Evento = require('./Evento');
const { requireChefe } = require('../middlewares/auth');

// ─── UPLOAD DE IMAGENS ────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/eventos');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'evento-' + Date.now() + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Apenas imagens são permitidas'));
    }
});

// ─── PÚBLICO: página de agenda (mensal) ───────────────────────────
router.get('/agenda', async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const eventos = await Evento.findAll({
            where: {
                tipo: 'agenda',
                data: { [Op.gte]: hoje }
            },
            order: [['data', 'ASC']]
        });
        res.render('agenda', { eventos });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// ─── PÚBLICO: página de calendário (anual) ────────────────────────
router.get('/calendario', async (req, res) => {
    try {
        const anoAtual = new Date().getFullYear();
        const eventos = await Evento.findAll({
            where: {
                tipo: 'calendario'
            },
            order: [['data', 'ASC']]
        });
        res.render('calendario', { eventos, anoAtual });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// ─── PROTEGIDO: listar eventos (admin) ────────────────────────────
router.get('/admin/eventos', requireChefe, async (req, res) => {
    try {
        const eventos = await Evento.findAll({ order: [['data', 'ASC']] });
        res.render('admin/eventos', { eventos });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/login');
    }
});

// ─── PROTEGIDO: formulário novo evento ────────────────────────────
router.get('/admin/eventos/novo', requireChefe, (req, res) => {
    res.render('admin/novoevento', { erro: null });
});

// ─── PROTEGIDO: salvar novo evento ────────────────────────────────
router.post('/admin/eventos/salvar', requireChefe, upload.single('imagem'), async (req, res) => {
    const { titulo, descricao, data, horario, tipo, local } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!titulo || !data || !tipo) {
        return res.render('admin/novoevento', { erro: 'Título, data e tipo são obrigatórios.' });
    }

    try {
        await Evento.create({
            titulo,
            descricao: descricao || null,
            data,
            horario: horario || null,
            tipo,
            imagem: tipo === 'agenda' ? imagem : null,
            local: local || null
        });
        res.redirect('/admin/eventos');
    } catch (err) {
        console.error(err);
        res.render('admin/novoevento', { erro: 'Erro ao salvar evento. Tente novamente.' });
    }
});

// ─── PROTEGIDO: deletar evento ────────────────────────────────────
router.post('/admin/eventos/deletar', requireChefe, async (req, res) => {
    const { id } = req.body;
    if (id != null && !isNaN(id)) {
        try {
            await Evento.destroy({ where: { id } });
        } catch (err) {
            console.error('Erro ao deletar evento:', err);
        }
    }
    res.redirect('/admin/eventos');
});

module.exports = router;
