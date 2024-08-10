"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadrequestError = void 0;
class ErrorParent extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
class BadrequestError extends ErrorParent {
    constructor(message) {
        super(message ? message : "Bad Request", 400);
    }
}
exports.BadrequestError = BadrequestError;
class UnauthorizedError extends ErrorParent {
    constructor(message) {
        super(message ? message : "Unauthorized", 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ErrorParent {
    constructor(message) {
        super(message ? message : "Forbidden", 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ErrorParent {
    constructor(message) {
        super(message ? message : "Not Found", 404);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends ErrorParent {
    constructor(message) {
        super(message ? message : "Internal Server Error", 500);
    }
}
exports.InternalServerError = InternalServerError;
class ValidationError extends Error {
    constructor(errors) {
        super("Validation Error");
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
exports.default = ErrorParent;
