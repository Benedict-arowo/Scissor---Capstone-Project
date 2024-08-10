"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml_1 = __importDefault(require("yaml"));
const server_1 = __importDefault(require("./server"));
const file = fs_1.default.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = yaml_1.default.parse(file);
server_1.default.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
try {
    server_1.default.listen(config_1.default.PORT, () => {
        console.log("Server listening on PORT", config_1.default.PORT);
    });
}
catch (error) {
    console.error("An error occured while trying to run the server", error);
}
