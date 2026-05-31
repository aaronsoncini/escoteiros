-- ================================================================
--  71º Grupo de Escoteiros Minuano — Script de Banco de Dados
--  Execute com: mysql -u root -p escoteiros < setup.sql
--  Ou cole direto no MySQL Command Line após: USE escoteiros;
-- ================================================================

USE escoteiros;

-- ────────────────────────────────────────────────────────────────
--  TABELA: eventos
--  Usada tanto pela Agenda (mensal, com imagem) quanto pelo
--  Calendário anual (sem imagem). O campo `tipo` diferencia os dois.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos (
    id          INT             NOT NULL AUTO_INCREMENT,
    titulo      VARCHAR(255)    NOT NULL,
    descricao   TEXT,
    data        DATE            NOT NULL,
    horario     VARCHAR(255),
    tipo        ENUM('agenda','calendario') NOT NULL DEFAULT 'agenda',
    imagem      VARCHAR(255),               -- apenas para tipo = 'agenda'
    local       VARCHAR(255),
    createdAt   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_eventos_data  (data),
    INDEX idx_eventos_tipo  (tipo)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────────
--  TABELA: parceiros
--  Empresas Amigas exibidas na página /parceiros
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parceiros (
    id          INT             NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(255)    NOT NULL,
    descricao   TEXT,
    link        VARCHAR(255),
    rede        VARCHAR(255),   -- ex: 'Instagram', 'Website', 'Facebook'
    imagem      VARCHAR(255),   -- nome do arquivo salvo em public/imgs/parceiros/
    createdAt   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_parceiros_nome (nome)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────────
--  DADOS DE EXEMPLO — remova ou ajuste antes de ir para produção
-- ────────────────────────────────────────────────────────────────

-- Eventos de exemplo
INSERT INTO eventos (titulo, descricao, data, horario, tipo, local) VALUES
('Reunião Semanal',     'Atividades regulares do grupo com todos os ramos.',         '2026-06-07',  '14h às 18h',   'agenda',     'Sede do Grupo — Av. Waldemar Tietz, 1154'),
('Acampamento Mensal',  'Acampamento de fim de semana na Serra da Cantareira.',      '2026-06-14',  '08h (sábado)', 'agenda',     'Parque Estadual da Cantareira'),
('Reunião Semanal',     'Atividades regulares do grupo com todos os ramos.',         '2026-06-21',  '14h às 18h',   'agenda',     'Sede do Grupo — Av. Waldemar Tietz, 1154'),
('Dia dos Escoteiros',  'Comemoração do Dia Mundial do Escotismo.',                  '2026-08-01',  'A confirmar',  'calendario', 'Sede do Grupo'),
('Jamboree Regional',   'Encontro regional de grupos escoteiros do estado de SP.',   '2026-09-15',  'A confirmar',  'calendario', 'A definir'),
('Natal Solidário',     'Arrecadação de brinquedos e ação comunitária.',             '2026-12-13',  '10h às 16h',   'calendario', 'Sede do Grupo');

-- Parceiro de exemplo
INSERT INTO parceiros (nome, descricao, link, rede) VALUES
('Apoiador Minuano', 'Empresa parceira que apoia as atividades do grupo.', 'https://www.exemplo.com.br', 'Website');

-- ────────────────────────────────────────────────────────────────
--  VERIFICAÇÃO FINAL
-- ────────────────────────────────────────────────────────────────
SELECT 'Tabelas criadas:' AS '';
SHOW TABLES;

SELECT CONCAT('eventos: ', COUNT(*), ' registro(s)') AS status FROM eventos
UNION ALL
SELECT CONCAT('parceiros: ', COUNT(*), ' registro(s)')          FROM parceiros;
