import type { AsstDataRequestInput } from "~/types/assistant";
import { openai } from "./openai";

export async function getAsstOutput({
  threadId,
  asstId,
}: AsstDataRequestInput) {
  try {
    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: asstId,
      stream: true,
    });

    const response = [];

    for await (const chunk of stream) {
      if (chunk.event === "thread.message.delta") {
        const content = chunk.data.delta.content as {
          text: {
            value: string;
          };
        }[];

        if (content) {
          const text = content[0].text.value;
          response.push(text);
        }
      }
    }

    const output = response.join("");

    return JSON.parse(output);
  } catch (error) {
    console.error("ERROR: ", error);
    return "";
  }
}
