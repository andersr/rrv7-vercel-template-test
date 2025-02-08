import OpenAI from "openai";
import { ENV } from "../ENV";

export const openai = new OpenAI({
  apiKey: ENV.OPEN_AI_API_KEY,
});
