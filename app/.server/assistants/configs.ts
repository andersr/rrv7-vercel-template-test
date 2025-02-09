import type { AssistantName } from "~/.server/assistants/names";
import { createTriviaGameConfig } from "~/lib/triviaGame/config";
import type { AsstConfig } from "~/types/assistant";

export const assistantConfigs: Record<AssistantName, AsstConfig> = {
  createTriviaGame: createTriviaGameConfig,
};
