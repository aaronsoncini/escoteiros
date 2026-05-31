const Sequelize = require('sequelize');
const connection = require('../database/database');

const Parceiro = connection.define('parceiros', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    link: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // Rede social ou canal principal (ex: 'Instagram', 'Website')
    rede: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Parceiro.sync({ force: true });

module.exports = Parceiro;
