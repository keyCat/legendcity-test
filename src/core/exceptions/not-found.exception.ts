import { HttpException } from './http.exception';
import { NOT_FOUND } from 'http-status-codes';

export class NotFoundException extends HttpException {
    constructor(
        message?: string | object | any,
        error: string = 'Not Found',
    ) {
        super(
            HttpException.toJsonBody(message, error, NOT_FOUND),
            NOT_FOUND,
        );
    }
}
