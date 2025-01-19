import { Redis } from "@upstash/redis";
import { ENV } from "~/lib/.server/ENV";

export const redisCache = new Redis({
  token: ENV.UPSTASH_REDIS_TOKEN,
  url: ENV.UPSTASH_REDIS_URL,
});
