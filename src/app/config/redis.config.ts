import { createClient } from "redis";
import { envVas } from "./env";

export const redisClient = createClient({
  password: envVas.Redis.REDIS_PASSWORD || undefined,
  socket: {
    host: envVas.Redis.REDIS_HOST || "127.0.0.1",
    port: Number(envVas.Redis.REDIS_PORT) || 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis connecting..."));
redisClient.on("ready", () => console.log("Redis ready"));
redisClient.on("end", () => console.log("Redis connection closed"));
redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Connected to Redis");
    }
  } catch (err) {
    console.error("Failed to connect Redis:", err);
  }
};
