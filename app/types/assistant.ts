import type { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import type { TriviaGame, triviaGameSchema } from "~/lib/triviaGame/schemas";
import type { NodeEnv } from "./env";

export interface AssistantPayload {
  threadId: string;
  game: TriviaGame;
}

export interface AsstDataRequestInput {
  threadId: string;
  asstId: string;
}

export interface AsstConfig {
  /**
   * The OpenAI model to use. Be sure to use a model that supports structured output, eg "gpt-4o-mini". See https://platform.openai.com/docs/guides/structured-outputs#supported-models
   */
  model: AssistantCreateParams["model"];
  /**
   * Instructions provided to the assistant.
   */
  instructions: string;
  /**
   * Describe how the assistant is used in the app.
   */
  description: string;
  /**
   * Union of supported schemas
   */
  schema: typeof triviaGameSchema;
}

/**
 * Used for storing and retrieving assistant ids from a KV store.
 */
export type AsstIdStore = Record<NodeEnv, string>;
