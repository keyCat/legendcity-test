import { HttpException } from './http.exception';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

export class InternalServerErrorException extends HttpException {
    constructor(
        message?: string | object | any,
        error: string = 'Internal Server Error',
    ) {
        super(
            HttpException.toJsonBody(message, error, INTERNAL_SERVER_ERROR),
            INTERNAL_SERVER_ERROR,
        );
    }
}
