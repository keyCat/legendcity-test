/**
 * JSON Schema Class Decorators
 * Author: François Marie De Mey (https://github.com/eddow)
 * URL: https://github.com/eddow/ts-json-schema-decorator
 * */
import 'reflect-metadata';

export const factories = {
    makeType: []
};

export const jsdTypes: { [key: string]: string } = {
    Array: 'array',
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Object: 'object',
};

export function option(value: any, model: any, ...path: any[]) {
    for (let i = 0; i < path.length; ++i) {
        path.splice(i, 1, ...path[i].split('.'));
    }
    if ('function' !== typeof model) {
        path.unshift('constructor');
    }
    while (1 < path.length) {
        let prop = path.shift();
        model = model[prop] || (model[prop] = {});
    }
    let prop = path[0];
    if (model.hasOwnProperty(prop)) {
        if (Object === value.constructor) {
            model[prop] = Object.assign({}, model[prop], value);
        }
        return model[prop];
    }
    return model[prop] = value;
}

export function getPropertyDescriptor(model: any, key: any) {
    var props = option({}, model, 'schema.properties', key);
    if (!props.type && !props.$ref) {
        let type = Reflect.getMetadata('design:type', model, key);
        if (type) {
            Object.assign(props, makeType(type, model, key));
        }
    }
    return props;
}

export function createPropertyDecorator(descriptor: any, restriction?: any): PropertyDecorator {
    //TODO3: restriction is a type name ('string', 'number', ...) that must restrict the appliable types
    return (model, key) => {
        var propDescr = getPropertyDescriptor(model, key);
        Object.assign(propDescr, 'function' === typeof descriptor ? descriptor(model, key) : descriptor);
    };
}

export function makeType(type: any, model: any, property: any) {
    for (let factory of factories.makeType as any[]) {
        let trial = factory(type, model, property);
        if (trial) {
            return trial;
        }
    }
    if (Object === type.constructor) {
        return type;
    }
    if ('function' === typeof type) {
        if (type.schema) {
            type = Object.assign({ type: 'object' }, type.schema);
        } else {
            //console.assert(jsdTypes[type.name], `Type must have a schema or be a basic js-data type : ${type}`)
            type = { type: jsdTypes[type.name] || 'object' };
        }
    } else if ('string' === typeof type) {
        type = { type };
    }
    return type;
}
