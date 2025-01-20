import type { TriviaGame } from "./game";

export interface AssistantPayload {
  threadId: string;
  game: TriviaGame;
}
