/**
 * - Used for upserting assistants in the db and binding to an OpenAi Assistant Id.
 * - To add a new assistant, add a UNIQUE id and then add the corresponding assistant config.
 * - Ids should be named based on what the assistant outputs.
 */
export const ASSISTANT_IDS = ["createTriviaGame"] as const;

export type AssistantId = (typeof ASSISTANT_IDS)[number];
