const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const connection = require('../database/database');

// Modelo de Evento — serve para Agenda (mensal, com imagem) e Calendário (anual, sem imagem)
const Evento = connection.define('eventos', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horario: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // 'agenda' = evento mensal (pode ter imagem) | 'calendario' = evento anual (sem imagem)
    tipo: {
        type: Sequelize.ENUM('agenda', 'calendario'),
        allowNull: false,
        defaultValue: 'agenda'
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true  // Apenas para eventos do tipo 'agenda'
    },
    local: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Evento.sync({ force: true });

module.exports = Evento;
