import { useEffect, useState, type JSX } from "react";
import { redirect, useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getAsstOutput } from "~/.server/openai/getAssistantOutput";
import { openai } from "~/.server/openai/openai";
import { redisStore } from "~/.server/redis/redis";
import { generateId } from "~/.server/utils/generateId";
import { requireAsstIds } from "~/.server/utils/requireAsstIds";
import { requireEnv } from "~/.server/utils/requireEnv";
import { ANOTHER_GAME_PROMPT } from "~/lib/triviaGame/prompts";
import { ERROR_PARAM } from "~/shared/params";
import type { AssistantPayload } from "~/types/assistant";
import NewGameForm from "~/ui/NewGameForm";
import QuestionHeader from "~/ui/QuestionHeader";
import type { Route } from "./+types/games.$id";

type GameView = "question" | "answer" | "end";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Structured Output Demo" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect(`/?${ERROR_PARAM}=true`);
  }

  const payload = await redisStore.get<AssistantPayload | null>(params.id);

  if (!payload) {
    throw redirect(`/?${ERROR_PARAM}=true`);
  }

  return {
    id: params?.id,
    game: payload.game,
  };
}

export async function action({ params }: Route.ActionArgs) {
  const currentGame = await redisStore.get<AssistantPayload | null>(params.id);

  if (!currentGame) {
    throw new Error("no current game found.");
  }

  if (!currentGame?.threadId) {
    throw new Error("no game thread found.");
  }

  await openai.beta.threads.messages.create(currentGame?.threadId, {
    role: "user",
    content: ANOTHER_GAME_PROMPT,
  });

  const env = requireEnv();
  const asstIds = await requireAsstIds("createTriviaGame");

  const output = await getAsstOutput({
    asstId: asstIds[env],
    threadId: currentGame.threadId,
  });
  const id = generateId();

  await redisStore.set<AssistantPayload>(
    id,
    {
      game: output,
      threadId: currentGame.threadId,
    },
    {
      ex: 60 * 60 * 24, // Expires in 24h
    }
  );

  return redirect(`/games/${id}`);
}

export default function GameDetails({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<GameView>("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const game = loaderData?.game;
  const currentQuestion = game?.questions
    ? game?.questions[questionIndex]
    : null;

  function handleChoice() {
    if (selectedChoice === currentQuestion?.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }
    setCurrentView("answer");
  }

  function handleNext() {
    if (questionIndex === game?.questions.length - 1) {
      setCurrentView("end");
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelectedChoice("");
      setCurrentView("question");
    }
  }

  function resetGame() {
    setCorrectAnswers(0);
    setSelectedChoice("");
    setQuestionIndex(0);
    setCurrentView("question");
  }

  useEffect(() => {
    resetGame();
  }, [location.pathname]);

  const gameViews: Record<GameView, JSX.Element> = {
    question: (
      <div>
        <QuestionHeader
          question={currentQuestion?.question}
          questionIndex={questionIndex}
          totalQuestions={game?.questions.length}
        />
        <ul className=" list-none pl-0">
          {currentQuestion?.choices.map((c) => (
            <li key={c}>
              <label
                className={twMerge(
                  "label cursor-pointer border rounded px-2 hover:bg-slate-100",
                  selectedChoice === c ? "bg-slate-200" : ""
                )}
              >
                <span className="label-text">{c}</span>
                <input
                  type="radio"
                  className="radio"
                  value={c}
                  name="choice"
                  checked={selectedChoice === c}
                  onChange={(e) => setSelectedChoice(c)}
                />
              </label>
            </li>
          ))}
        </ul>
        <button
          disabled={selectedChoice === ""}
          onClick={handleChoice}
          className="btn cursor-pointer"
        >
          Submit Answer
        </button>
      </div>
    ),
    answer: (
      <div>
        <QuestionHeader
          question={currentQuestion?.question}
          questionIndex={questionIndex}
          totalQuestions={game?.questions.length}
        />
        <p>Your answer: {selectedChoice}</p>
        <p>
          {currentQuestion?.correctAnswer === selectedChoice ? (
            <span className="text-primary font-semibold">Correct answer!</span>
          ) : (
            <span className="text-red-500 font-semibold">
              Sorry, the correct answer is: {currentQuestion?.correctAnswer}.
            </span>
          )}
        </p>
        <p>
          <button onClick={handleNext} className="btn cursor-pointer">
            {questionIndex === game?.questions.length - 1
              ? "Continue"
              : "Next Question"}
          </button>
        </p>
      </div>
    ),
    end: (
      <div>
        <h2>Results</h2>
        <p>Correct answers: {correctAnswers}</p>
        <p>
          <button onClick={resetGame} className="btn">
            Play Again
          </button>
        </p>
        <div>
          <NewGameForm />
        </div>
      </div>
    ),
  };
  return (
    <div className="p-4">
      <h1>Trivia Game</h1>
      {gameViews[currentView]}
    </div>
  );
}
