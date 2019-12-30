import 'reflect-metadata';
import { JsonSchema } from './jsonschema/schema.decorator';
import { IReqSchema, VALIDATE_META } from '@core';

export const Validate = (schema: typeof JsonSchema & IReqSchema): MethodDecorator => {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(VALIDATE_META, schema, descriptor);
    };
};
