import type { TriviaGame } from "~/lib/triviaGame/schemas";

export const TEST_GAME: TriviaGame = {
  questions: [
    {
      category: "Science",
      question: "What is the chemical symbol for the element gold?",
      choices: ["Au", "Ag", "Pb", "Fe"],
      correctAnswer: "Au",
    },
  ],
};

export const TEST_GAME_ID = "TEST_1";
export const TEST_THREAD_ID = "TEST_THREAD_ID_1";
