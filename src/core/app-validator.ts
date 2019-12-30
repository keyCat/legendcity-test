import Ajv from 'ajv';
import { Request, Response } from 'express';
import { JsonSchema } from '@decorators';
import { HttpException, UnprocessableEntityException } from './exceptions';

export interface IReqSchema {
    params?: JsonSchema;
    query?: JsonSchema;
    body?: JsonSchema;
}

/**
 * App validation based on JSONSchema and ajv
 * */
export class AppValidator {
    private readonly ajv: Ajv.Ajv;

    constructor() {
        this.ajv = new Ajv();
    }

    private static convertAjvErrorsIntoAMessage(errors: Ajv.ErrorObject[]): string[] {
        let errorMessages: string[] = [];
        // sanity check
        if (!errors) {
            return errorMessages;
        }

        errorMessages = errors.map((err): string => {
            const propPath = err.dataPath.substring(1, err.dataPath.length);
            return `\`${propPath}\` ${err.message}`;
        });

        return errorMessages;
    }

    validateRequest(req: Request, Schema: typeof JsonSchema & IReqSchema): boolean {
        const { params, query, body } = req;
        const isValid = this.ajv.validate(Schema.getSchema(), { params, query, body });

        if (!isValid) {
            let message = null;
            if (this.ajv.errors) {
                message = AppValidator.convertAjvErrorsIntoAMessage(this.ajv.errors);
            }
            throw new UnprocessableEntityException(message, 'Validation Error');
        }

        return isValid === true;
    }
}
