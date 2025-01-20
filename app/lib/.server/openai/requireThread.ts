import type { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { openai } from "./openai";

export async function requireThread({ prompt }: { prompt: string }) {
  try {
    const input: ThreadCreateParams = {
      messages: [
        {
          content: prompt,
          role: "user",
        },
      ],
    };

    return await openai.beta.threads.create(input);
  } catch (error) {
    console.error("error: ", error);
    throw new Error("error creating thread");
  }
}
