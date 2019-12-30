import 'reflect-metadata';
import { ROUTES_META, VALIDATE_META } from '../core/constants';

/**
 * Factory for MethodDecorator responsible for creating a router definition
 * */
const createHttpMethodDecorator = (method: string, path: string = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor) => {
        if (!Reflect.hasMetadata(ROUTES_META, target.constructor)) {
            Reflect.defineMetadata(ROUTES_META, [], target.constructor);
        }

        const routes = Reflect.getMetadata(ROUTES_META, target.constructor);
        const validation = Reflect.getMetadata(VALIDATE_META, descriptor);
        path = path || '/';
        routes.push({
            method,
            path,
            validation,
            key: propertyKey,
        });
        Reflect.defineMetadata(ROUTES_META, routes, target.constructor);
    };
};

const Get = (path?: string) => createHttpMethodDecorator('get', path);

const Post = (path?: string) => createHttpMethodDecorator('post', path);

const Put = (path?: string) => createHttpMethodDecorator('put', path);

const Delete = (path?: string) => createHttpMethodDecorator('delete', path);

export { Get, Post, Put, Delete };
