import { z } from "zod";

const triviaQuestionSchema = z.object({
  category: z.string().describe("The question category, eg Music"),
  question: z.string().describe("The trivia question."),
  choices: z
    .string()
    .array()
    .describe(
      "The answer choices, which should include one correct answer and three distractor choices."
    ),
  correctAnswer: z.string().describe("The correct answer."),
});

export const triviaGameSchema = z.object({
  questions: triviaQuestionSchema
    .array()
    .describe(
      "A collection of trivia questions. Each question should be unique within the collection. Question categories should be a varied mix."
    ),
});

export type TriviaGame = z.infer<typeof triviaGameSchema>;
export type TriviaGameQuestion = z.infer<typeof triviaQuestionSchema>;
