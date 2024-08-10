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
const faker_1 = require("@faker-js/faker");
const server_1 = __importDefault(require("../server"));
describe("Auth Routes", () => {
    let userCredentials = {
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
    };
    describe("Registration Tests", () => {
        test("should throw 409 due to invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/api/auth/register")
                .send({
                email: "nonexistent@example.com",
            });
            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty("errors");
        }));
        test("should successfully register a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/api/auth/register")
                .send(userCredentials);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("email", userCredentials.email);
        }));
    });
    describe("Login Tests", () => {
        test("should throw 409 due to invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
                email: "nonexistent@example.com",
            });
            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty("errors");
        }));
        test("should successfully login a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/api/auth/login")
                .send(userCredentials);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("access_token");
        }));
    });
});
