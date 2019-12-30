import 'reflect-metadata';
import { BASE_URL_META, ROUTES_META } from '../core/constants';

/**
 * Decorator for a controller. Allows to assign base url for a router
 * @param {string} baseUrl - Path prefix
 * */
const Controller = (baseUrl: string = ''): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata(BASE_URL_META, baseUrl, target);
        if (!Reflect.hasMetadata(ROUTES_META, target)) {
            // initialize routes store
            Reflect.defineMetadata(ROUTES_META, [], target);
        }
    };
};

export { Controller };
