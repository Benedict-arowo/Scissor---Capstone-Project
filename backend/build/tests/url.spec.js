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
describe("URL Routes", () => {
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
        const demo_user = yield prisma.user.create({
            data: {
                email,
                password,
            },
        });
        const token = yield prisma.token.create({
            data: {
                user_id: demo_user.email,
                token: faker_1.faker.string.uuid(),
                expiration_date: new Date(new Date().setHours(new Date().getHours() + 1)),
                is_revoked: false,
            },
        });
        user.access_token = auth_service_1.default["generateToken"]({ email });
        user.api_token = token.token;
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
    describe("Create URL Route - /api/url", () => {
        it("should create a new URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/api/url")
                .set("Authorization", `Bearer ${user.access_token}`)
                .send({
                long_url: "https://example.com",
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("long_url", "https://example.com");
            user.url.id = response.body.data.id;
            user.url.short_url = response.body.data.short_url;
        }));
        it("should create a new URL with custom url", () => __awaiter(void 0, void 0, void 0, function* () {
            const custom_url = faker_1.faker.string.alphanumeric({
                length: { min: 5, max: 7 },
            });
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/api/url")
                .set("Authorization", `Bearer ${user.access_token}`)
                .send({
                long_url: "https://example.com",
                short_url: custom_url,
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("short_url", custom_url);
            expect(response.body.data.owner_id).toBeDefined();
        }));
        it("should create a new URL without being authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default).post("/api/url").send({
                long_url: "https://example.com",
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("data");
        }));
    });
    describe("GET /api/url", () => {
        it("should return a list of URLs", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get("/api/url")
                .set("Authorization", `Bearer ${user.access_token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        }));
    });
    describe("GET /api/url/:id", () => {
        it("should return a single URL by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get(`/api/url/${user.url.id}`)
                .set("Authorization", `Bearer ${user.access_token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("long_url");
        }));
        it("should return a single URL by ID using api-token", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get(`/api/url/${user.url.id}`)
                .set("api_key", user.api_token);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("long_url");
        }));
    });
    describe("PATCH /api/url/:id", () => {
        it("should update a URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch(`/api/url/${user.url.id}`)
                .set("Authorization", `Bearer ${user.access_token}`)
                .send({
                long_url: "https://newexample.com",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("long_url", "https://newexample.com");
        }));
        it("should update a URL using api-token", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .patch(`/api/url/${user.url.id}`)
                .set("api_key", user.api_token)
                .send({
                long_url: "https://oldexample.com",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("long_url", "https://oldexample.com");
        }));
    });
    describe("GET /:id", () => {
        it("should visit a URL and update stats", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .get(`/${user.url.short_url}`)
                .set("User-Agent", "Mozilla/5.0")
                .set("X-Forwarded-For", "123.123.123.123");
            expect(response.status).toBe(200);
            expect(response.text).toContain("Redirecting...");
        }));
    });
    describe("POST /api/url/:id/qrcode", () => {
        it("should generate a QR code for a URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post(`/api/url/${user.url.id}/qrcode`)
                .set("Authorization", `Bearer ${user.access_token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("url");
        }));
    });
    describe("DELETE /api/url/:id", () => {
        it("should fail to delete a URL with no auth", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default).delete(`/api/url/${user.url.id}`);
            expect(response.status).toBe(401);
        }));
        it("should delete a URL", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .delete(`/api/url/${user.url.id}`)
                .set("Authorization", `Bearer ${user.access_token}`);
            expect(response.status).toBe(204);
        }));
    });
});
