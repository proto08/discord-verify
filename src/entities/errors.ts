export class HttpError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "BadRequest") {
        super(message, 401);
    }
}