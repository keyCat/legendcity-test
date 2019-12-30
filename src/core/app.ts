import 'reflect-metadata';
import express, { Express } from 'express';
import * as Http from 'http';
import { AppRouter } from './app-router';

export class ExpressApp {
    private port: number;
    private app: Express;
    private appRouter: AppRouter;
    private server: Http.Server | undefined;

    constructor() {
        this.app = express();
        this.appRouter = new AppRouter();
        this.port = parseInt(process.env.PORT as string, 10) || 3000;
    }

    public getPort(): number {
        return this.port;
    }

    public getExpressApp(): Express {
        return this.app;
    }

    /**
     * Registers Express middleware
     * @param {function[]} middleware - Array of middleware functions
     * */
    public useMiddleware(middleware: any[]): void {
        middleware.forEach((m) => this.app.use(m));
    }

    /**
     * Registers Controllers using Express router, also acts as a crude routing middleware.
     * @param {Function[]} controllers - Array of controller classes decorated by @Controller()
     * */
    public useControllers(controllers: any[]): void {
        controllers.forEach((Controller) => this.appRouter.addController(Controller));
        const routers = this.appRouter.getRoutersByPath();
        // register routers
        Object.keys(routers).forEach((path) => {
            this.app.use(path, routers[path]);
        });
    }

    /**
     * Starts Http Server. The port is read from PORT environment variable
     * */
    public async start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(
                this.port,
                (err) => {
                    if (err) { return reject(err); }
                    return resolve();
                });
        });
    }
}
