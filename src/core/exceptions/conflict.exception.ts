import { HttpException } from './http.exception';
import { CONFLICT } from 'http-status-codes';

export class ConflictException extends HttpException {
    constructor(
        message?: string | object | any,
        error: string = 'Conflict',
    ) {
        super(
            HttpException.toJsonBody(message, error, CONFLICT),
            CONFLICT,
        );
    }
}
