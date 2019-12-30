import 'reflect-metadata';
import express, { Router, Request, Response } from 'express';
import { BASE_URL_META, ROUTES_META } from './constants';
import { HttpException } from './exceptions';
import { AppValidator, InternalServerErrorException, IReqSchema } from '@core';
import { JsonSchema } from '@decorators';

export interface IRouterByPath {
    [path: string]: Router;
}

export interface IRouteDefinition {
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
    key: string;
    validation?: typeof JsonSchema & IReqSchema;
}

type ControllerMethod = (req: Request, res: Response) => any | Promise<any>;

/**
 * Crude application router on top of Express Router.
 * Based on controller methods, rather than on route handler callbacks.
 * */
export class AppRouter {
    private readonly routers: IRouterByPath = {}; // reuse routers for path
    private readonly validator: AppValidator = new AppValidator();

    public getRoutersByPath(): IRouterByPath {
        return this.routers;
    }

    /**
     * Adds controller and registers an appropriate router for its methods
     * @param {Function} Controller - Controller constructor function
     * @return {Router|null} router - Express Router for controller
     * */
    public addController(Controller: any): Router | null {
        if (!Reflect.hasMetadata(ROUTES_META, Controller)) { return null; }
        const basePath: string = Reflect.getMetadata(BASE_URL_META, Controller) || '/';
        const router: Router = this.routers[basePath] || express.Router();
        const definitions: IRouteDefinition[] = Reflect.getMetadata(ROUTES_META, Controller);
        const instance = new Controller();

        // go through controller definitions and assign handlers
        definitions.forEach((definition) => {
            const controllerMethod = instance[definition.key].bind(instance);
            router[definition.method](
                definition.path,
                (req, res) => this.handleRequest(req, res, controllerMethod, definition.validation),
            );
        });

        this.routers[basePath] = router;

        return router;
    }

    /**
     * Handles controller method. Allows controller methods to return data / throw exceptions, or respond by themselves
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {ControllerMethod} method - Controller method handler
     * */
    private async handleRequest(
        req: Request,
        res: Response,
        method: ControllerMethod,
        Schema?: typeof JsonSchema & IReqSchema,
    ): Promise<void> {
        try {
            if (Schema) {
                this.validator.validateRequest(req, Schema);
            }
            const result = await method(req, res);
            // response was sent from controller method or somewhere else
            if (res.headersSent) {
                return;
            }

            res.json(result);
        } catch (e) {
            this.handleException(req, res, e);
        }
    }

    /**
     * Handles an exception and forms a user-friendly response
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {Error|HttpException|any} exception - Error
     * */
    private handleException(req: Request, res: Response, exception: Error | HttpException | any): void {
        const isHttpException = exception instanceof HttpException;

        if (res.headersSent) {
            return;
        }

        // wrap non-app exceptions as an Internal Server Error
        if (!isHttpException) {
            exception = exception
                ? new InternalServerErrorException(exception.message, exception.name)
                : new InternalServerErrorException();
        }
        // reply with exception status code and a body
        res
            .status(exception.getStatus())
            .json(exception.getResponse());
    }
}
