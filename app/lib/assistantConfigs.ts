import type { AssistantId } from "~/lib/assistantIds";
import type { AsstConfig } from "~/types/assistant";
import { triviaGameSchema } from "./gameSchema";

export const assistantConfigs: Record<AssistantId, AsstConfig> = {
  createTriviaGame: {
    model: "gpt-4o-mini",
    instructions: `Create a 3-question multiple choice trivia game. For each game, randomly select 3 common trivia game categories and create one question in each category.  Do not repeat questions that have been asked in previous games.  Ensure one correct answer per question and logical, plausible distractor choices. Provide your response in JSON format using attached schema.`,
    description: "Generates trivia game questions.",
    schema: triviaGameSchema,
  },
};
