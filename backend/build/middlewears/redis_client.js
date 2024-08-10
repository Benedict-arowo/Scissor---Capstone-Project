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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKeysByPattern = exports.getRedisKey = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();
const getRedisKey = (req) => {
    const key = `${req.url}|+|${req.user ? req.user.email : "-"}|+|${JSON.stringify(req.query)}|+|${JSON.stringify(req.params)}`;
    return key;
};
exports.getRedisKey = getRedisKey;
const deleteKeysByPattern = (pattern) => __awaiter(void 0, void 0, void 0, function* () {
    let cursor = 0; // Initialize cursor as a number
    const keysToDelete = [];
    do {
        const reply = yield redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
        });
        keysToDelete.push(...reply.keys);
    } while (cursor !== 0);
    if (keysToDelete.length > 0) {
        yield redisClient.del(...keysToDelete);
    }
});
exports.deleteKeysByPattern = deleteKeysByPattern;
exports.default = redisClient;
