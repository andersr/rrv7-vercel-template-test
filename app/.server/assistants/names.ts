/**
 * Ids should be based on what the assistant outputs.
 */
export const ASSISTANT_NAMES = ["createTriviaGame"] as const;

export type AssistantName = (typeof ASSISTANT_NAMES)[number];
