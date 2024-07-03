"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const error_handler_middlewear_1 = __importDefault(require("./middlewears/error_handler.middlewear"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)(config_1.default.CORS_OPTION));
(0, index_1.default)(app);
app.use(error_handler_middlewear_1.default);
try {
    app.listen(config_1.default.PORT, () => {
        console.log("Server listening on PORT", config_1.default.PORT);
    });
}
catch (error) {
    console.error("An error occured while trying to run the server", error);
}
