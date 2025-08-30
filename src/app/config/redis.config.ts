import { createClient } from "redis";
import { envVas } from "./env";

export const redisClient = createClient({
  username: envVas.Redis.REDIS_USERNAME,
  password: envVas.Redis.REDIS_PASSWORD,
  socket: {
    host: envVas.Redis.REDIS_HOST,
    port: Number(envVas.Redis.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// await redisClient.set("foo", "bar");
// const result = await redisClient.get("foo");
// console.log(result); // >>> bar

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Connect Redis");
  }
};
