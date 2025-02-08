import { z } from "zod";

const envCollection = z.object({
  OPEN_AI_API_KEY: z.string().min(3),
  OPENAI_ASST_ID_CREATE_GAME: z.string().min(3),
  UPSTASH_REDIS_TOKEN: z.string().min(3),
  UPSTASH_REDIS_URL: z.string().url(),
});

export const ENV = envCollection.parse(process.env);
