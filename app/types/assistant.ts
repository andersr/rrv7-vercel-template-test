import type { AssistantId } from "~/asstIds";
import type { TriviaGame } from "./game";

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
   * Instructions provided to the assistant.
   */
  instructions: string;
  /**
   * Describe how the assistant is used in the app.
   */
  description: string;
  /**
   * Used as primary db key and as a basis for the assistant name
   */
  key: AssistantId;
}

export interface AsstDataRequestInput {
  threadId: string;
  asstId: string;
}
