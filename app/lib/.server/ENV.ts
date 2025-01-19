import { z } from "zod";

export const envSchema = {
  OPEN_AI_API_KEY: z.string().min(3),
  OPENAI_ASST_IDS: z.string().min(3),
  OPENAI_ASST_ID_CREATE_GAME: z.string().min(3),
  UPSTASH_REDIS_TOKEN: z.string().min(3),
  UPSTASH_REDIS_URL: z.string().url(),
};

const envCollection = z.object(envSchema);

export const ENV = envCollection.parse(process.env);
