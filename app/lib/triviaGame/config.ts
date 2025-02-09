import type { AsstConfig } from "~/types/assistant";
import { triviaGameSchema } from "./schemas";

export const createTriviaGameConfig: AsstConfig = {
  model: "gpt-4o-mini",
  instructions:
    "Create a 3-question multiple choice trivia game. For each game, randomly select 3 common trivia game categories and create one question in each category. Do not repeat previously asked questions. Ensure one correct answer per question and logical, plausible distractor choices. Provide your response in JSON format using the attached schema.",
  description: "Generates trivia game questions.",
  schema: triviaGameSchema,
};
