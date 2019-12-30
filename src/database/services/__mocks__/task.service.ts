import alasql from 'alasql';
import { FindOptions, Sequelize } from 'sequelize';

const sequelize = new Sequelize({ dialect: 'postgres' });
const QueryGenerator: any = sequelize.getQueryInterface().QueryGenerator;

export class TaskService {
    private static instance: TaskService;

    constructor() {
        if (TaskService.instance) { return TaskService.instance; }
        alasql.options.errorlog = true;
        alasql.options.logtarget = 'console';
        alasql.options.logprompt = true;
        alasql.options.postgres = true;
        alasql(`CREATE DATABASE IF NOT EXISTS test; USE test;`);
        alasql(
                `CREATE TABLE tasks ( id INT AUTOINCREMENT PRIMARY KEY, title STRING, priority INT);`,
        );
        TaskService.instance = this;
    }

    public async findOne(options: FindOptions) {
        const whereSql = QueryGenerator.getWhereConditions(options.where || {}).replace(/"/g, '');
        const rows = await alasql.promise(
            `SELECT * FROM tasks WHERE ${whereSql};`,
        );
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    public async findById(taskId: string | number) {
        const rows = await alasql.promise(
            `SELECT * FROM tasks WHERE id = ${taskId};`,
        );
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    public async getOneOfHighestPriority() {
        const rows = await alasql.promise(
                `SELECT * FROM tasks ORDER BY priority ASC LIMIT 1;`,
        );
        if (rows && rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    public async create(createDto: any) {
        const nextId = alasql.autoval('tasks', 'id', true);
        await alasql.promise(
            `INSERT INTO tasks (title, priority) VALUES (\'${createDto.title}\', ${createDto.priority});`,
        );
        const rows = await alasql.promise(
            `SELECT * FROM tasks WHERE id=${nextId};`,
        );
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    public async delete(taskId: number | string) {
        await alasql.promise(`DELETE FROM tasks WHERE id = ${taskId};`);
        return true;
    }
}
