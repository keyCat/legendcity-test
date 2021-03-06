/**
 * JSON Schema Class Decorators
 * Author: François Marie De Mey (https://github.com/eddow)
 * URL: https://github.com/eddow/ts-json-schema-decorator
 * */
import 'reflect-metadata';
import { option, createPropertyDecorator, getPropertyDescriptor, jsdTypes, makeType } from './utils';

/**
 * Validate that this value is specified
 * @param {boolean} required Validation fails if unspecified (null/undefined)
 */
export function Required(required = true) {
    return (model: any, key: any) => {
        getPropertyDescriptor(model, key);	//touch
        if (required) {
            option([], model, 'schema.required').push(key);
        }
    };
}

/**
 * TODO
 * @param dependency
 */
export function Dependency(dependency: any) {
    return (model: any, key: any) => {
        getPropertyDescriptor(model, key);	//touch
        option(dependency, model, 'schema.dependencies', key);
    };
}

/**
 * Declare this a property and give custom options
 * TODO: option list fron js-data json schema
 * @param {hash} opts List of options to give
 */
export function Property(opts = {}) { return createPropertyDecorator(opts); }

/**
 * TODO
 * @param definition
 */
export function Defined(definition: any) {
    return (model: any, key: any) => {
        option({ $ref: `#/definitions/${definition}` }, model, 'schema.properties', key);
        option([], model, 'defined', definition).push(key);
    };
}

/**
 * Declare the unitary type of a property
 * @param {function} type Constructor
 */
export function Type(type: any) { return createPropertyDecorator((model: any, key: any) => makeType(type, model, key)); }

/**
 * Gives the value to give to the property if it is not specified
 * @param {any} value Value given to the property if not specified
 */
export function Default(value: any) { return createPropertyDecorator({ 'default': value }); }

/**
 * List the possible values of this property
 * @param {array(any)} values List of accepted valued
 */
export function Enum(...values: any[]) { return createPropertyDecorator({ 'enum': values }); }

/**
 * TODO
 * @param format
 */
export function Format(format: any) { return createPropertyDecorator({ format }); }

/**
 * TODO
 * @param additionalProperties
 */
export function AdditionalProperties(additionalProperties: boolean | object) {
    return createPropertyDecorator({ additionalProperties }, 'object');
}

/**
 * TODO
 * @param patternProperties
 */
export function PatternProperties(patternProperties: object) {
    return createPropertyDecorator({ patternProperties }, 'object');
}

/**
 * Specifies the validation pattern of the string
 * @param {regexp} pattern Validation reg-exp
 */
export function Pattern(pattern: any) { return createPropertyDecorator({ pattern }, 'string'); }

/**
 * Gives a minimum length of the string
 * @param {number} minLength The minimum number of characters in the string
 */
export function MinLength(minLength = 1) { return createPropertyDecorator({ minLength }, 'string'); }

/**
 * Gives a maximum length of the string
 * @param {number} maxLength The maximum number of characters in the string
 */
export function MaxLength(maxLength: any) { return createPropertyDecorator({ maxLength }, 'string'); }

/**
 * Specify there is no fractional part to this number
 */
export const Integer = () => createPropertyDecorator({ type: 'integer' }, 'number');

/**
 * Gives a minimum value of a number
 * @param {number} minimum The minimum value of the property
 */
export function Minimum(minimum = 0) {
    return createPropertyDecorator({
        minimum,
    }, 'number');
}

/**
 * Gives a maximum value of a number
 * @param {number} maximum The maximum value of the property
 */
export function Maximum(maximum: any) {
    return createPropertyDecorator({
        maximum,
    }, 'number');
}

/**
 * Explicit the possible type(s) of the array items
 * @param {array(function)} items List of constructors of accepted types
 * @param uniqueItems TODO
 * @example @Items([Number, 'boolean', Address, {$ref: 'name'}])
 * @example @Items(String)
 */
export function Items(items: any, uniqueItems = false) {
    if (items instanceof Array) {
        items;
    }
    return createPropertyDecorator((model: any, key: any) => ({
        items: items instanceof Array ?
            items.map(item => makeType(item, model, key)) :
            makeType(items, model, key),
        uniqueItems
    }), 'array');
}

/**
 * Gives a minimum number of items for an array
 * @param {number} minItems The minimum number of items to validate an array
 */
export function MinItems(minItems: any) { return createPropertyDecorator({ minItems }, 'array'); }

/**
 * Gives a maximum number of items for an array
 * @param {number} maxItems The maximum number of items to validate an array
 */
export function MaxItems(maxItems: any) { return createPropertyDecorator({ maxItems }, 'array'); }
