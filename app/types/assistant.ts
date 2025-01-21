import type { TriviaGame } from "./game";

export interface AssistantPayload {
  threadId: string;
  game: TriviaGame;
}

export interface AsstDataRequestInput {
  threadId: string;
  asstId: string;
}
