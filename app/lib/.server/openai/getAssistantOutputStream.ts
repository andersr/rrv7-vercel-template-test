import { openai } from "./openai";

export interface CreateAssistantInput {
  instructions: string;
  name: string;
}

export interface AsstDataRequestInput {
  threadId: string;
  asstId: string;
}

export async function getAsstOutputStream({
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

    return output;
  } catch (error) {
    console.error("ERROR: ", error);
    return "";
  }
}
