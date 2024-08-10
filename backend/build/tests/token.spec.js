"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const server_1 = __importDefault(require("../server"));
const prisma = new client_1.PrismaClient();
describe("Token Routes", () => {
    let user = {
        access_token: undefined,
        api_token: undefined,
        email: undefined,
        url: {
            id: undefined,
            short_url: undefined,
        },
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const password = faker_1.faker.internet.password();
        const email = faker_1.faker.internet.email();
        yield prisma.user.create({
            data: {
                email,
                password,
            },
        });
        user.access_token = auth_service_1.default["generateToken"]({ email });
        user.email = email;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.delete({
            where: {
                email: user.email,
            },
        });
        yield prisma.$disconnect();
    }));
    it("should fail to create a new token no auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post("/api/token");
        expect(response.status).toBe(401);
    }));
    it("should create a new token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post("/api/token")
            .set("Authorization", `Bearer ${user.access_token}`)
            .send();
        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("token");
        user.api_token = response.body.data.token;
    }));
    it("should delete user's token using api-token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .delete("/api/token")
            .set("api_key", user.api_token);
        expect(response.status).toBe(204);
    }));
});
