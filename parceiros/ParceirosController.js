const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Parceiro = require('./Parceiro');
const { requireChefe } = require('../middlewares/auth');

// ─── UPLOAD DE LOGOS ──────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/parceiros');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'parceiro-' + Date.now() + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Apenas imagens são permitidas'));
    }
});

// ─── PÚBLICO: página de parceiros (Empresas Amigas) ───────────────
router.get('/parceiros', async (req, res) => {
    try {
        const parceiros = await Parceiro.findAll({ order: [['nome', 'ASC']] });
        res.render('parceiros', { parceiros });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// ─── PROTEGIDO: listar parceiros (admin) ──────────────────────────
router.get('/admin/parceiros', requireChefe, async (req, res) => {
    try {
        const parceiros = await Parceiro.findAll({ order: [['nome', 'ASC']] });
        res.render('admin/parceiros', { parceiros });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/login');
    }
});

// ─── PROTEGIDO: formulário novo parceiro ──────────────────────────
router.get('/admin/parceiros/novo', requireChefe, (req, res) => {
    res.render('admin/novoparceiro', { erro: null });
});

// ─── PROTEGIDO: salvar parceiro ───────────────────────────────────
router.post('/admin/parceiros/salvar', requireChefe, upload.single('imagem'), async (req, res) => {
    const { nome, descricao, link, rede } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!nome) {
        return res.render('admin/novoparceiro', { erro: 'O nome do parceiro é obrigatório.' });
    }

    try {
        await Parceiro.create({ nome, descricao: descricao || null, link: link || null, rede: rede || null, imagem });
        res.redirect('/admin/parceiros');
    } catch (err) {
        console.error(err);
        res.render('admin/novoparceiro', { erro: 'Erro ao salvar parceiro. Tente novamente.' });
    }
});

// ─── PROTEGIDO: deletar parceiro ──────────────────────────────────
router.post('/admin/parceiros/deletar', requireChefe, async (req, res) => {
    const { id } = req.body;
    if (id != null && !isNaN(id)) {
        try {
            await Parceiro.destroy({ where: { id } });
        } catch (err) {
            console.error('Erro ao deletar parceiro:', err);
        }
    }
    res.redirect('/admin/parceiros');
});

module.exports = router;
