import { Sequelize } from 'sequelize-typescript';
import { ModelsProvider } from '../models';

export class DbService {
    private static instance: DbService;
    private readonly sequelize: Sequelize;

    constructor() {
        if (DbService.instance) { return DbService.instance; }
        this.sequelize = new Sequelize({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string, 10) || 5432,
            database: process.env.DB_NAME || '',
            username: process.env.DB_USER || '',
            password: process.env.DB_PASS || '',
            models: ModelsProvider,
            dialect: 'postgres',
        });
        DbService.instance = this;
    }

    public connect(): Promise<void> {
        return this.sequelize.authenticate();
    }
}
