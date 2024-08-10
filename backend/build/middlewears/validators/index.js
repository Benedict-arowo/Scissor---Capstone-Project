"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const validator = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message.replace(/['"]/g, ""),
        }));
        throw new error_1.ValidationError(formattedErrors);
    }
    return 0;
};
exports.default = validator;
