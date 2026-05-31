// Verifica se o usuário está logado como admin (Administrador)
function requireAdmin(req, res, next) {
    if (req.session && req.session.adminLogado) {
        return next();
    }
    res.redirect('/admin/login');
}

// Verifica se o usuário está logado como chefe ou admin
function requireChefe(req, res, next) {
    if (req.session && (req.session.adminLogado || req.session.chefeLogado)) {
        return next();
    }
    res.redirect('/admin/login');
}

module.exports = { requireAdmin, requireChefe };
