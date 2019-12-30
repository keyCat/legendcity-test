export class HttpException extends Error {
    public readonly message: any;

    constructor(
        private readonly response: string | object,
        private readonly status: number,
    ) {
        super();
        this.message = response;
    }

    public getResponse(): string | object {
        return this.response;
    }

    public getStatus(): number {
        return this.status;
    }

    public static toJsonBody(
        message: object | string,
        error?: string,
        statusCode?: number,
    ): object {
        if (!message) { return { statusCode, error }; }
        // if object-like
        if (message !== null && typeof message === 'object' && !Array.isArray(message)) {
            return message;
        }
        return { statusCode, error, message };
    }
}
