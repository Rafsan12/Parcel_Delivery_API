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
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
exports.redisClient = (0, redis_1.createClient)({
    password: env_1.envVas.Redis.REDIS_PASSWORD || undefined,
    socket: {
        host: env_1.envVas.Redis.REDIS_HOST || "127.0.0.1",
        port: Number(env_1.envVas.Redis.REDIS_PORT) || 6379,
    },
});
exports.redisClient.on("error", (err) => console.error("Redis Client Error:", err));
exports.redisClient.on("connect", () => console.log("Redis connecting..."));
exports.redisClient.on("ready", () => console.log("Redis ready"));
exports.redisClient.on("end", () => console.log("Redis connection closed"));
exports.redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.redisClient.isOpen) {
            yield exports.redisClient.connect();
            console.log("Connected to Redis");
        }
    }
    catch (err) {
        console.error("Failed to connect Redis:", err);
    }
});
exports.connectRedis = connectRedis;
