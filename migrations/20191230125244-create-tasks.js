'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { sequelize } = queryInterface;
        await sequelize.query(`
CREATE TABLE IF NOT EXISTS public.tasks
(
    id       SERIAL       NOT NULL
        CONSTRAINT tasks_pk
            PRIMARY KEY,
    title    VARCHAR(255) NOT NULL,
    priority SMALLINT     NOT NULL
        CONSTRAINT priority_minmax_check
            CHECK ((priority >= 0) AND (priority <= 100))
);

CREATE UNIQUE INDEX IF NOT EXISTS tasks_id_uindex
    ON public.tasks (id);
                `);
    },

    down: async (queryInterface, Sequelize) => {
        const { sequelize } = queryInterface;
        await sequelize.query(`DROP TABLE IF EXISTS tasks;`);
    }
};
