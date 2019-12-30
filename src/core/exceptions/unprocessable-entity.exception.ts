import { HttpException } from './http.exception';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';

export class UnprocessableEntityException extends HttpException {
    constructor(
        message?: string | object | any,
        error: string = 'Unprocessable Entity',
    ) {
        super(
            HttpException.toJsonBody(message, error, UNPROCESSABLE_ENTITY),
            UNPROCESSABLE_ENTITY,
        );
    }
}
