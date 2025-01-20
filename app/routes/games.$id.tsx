import { useEffect, useState, type JSX } from "react";
import { Form, redirect, useLocation, useNavigation } from "react-router";
import { twMerge } from "tailwind-merge";
import { ENV } from "~/lib/.server/ENV";
import { generateId } from "~/lib/.server/generateId";
import { getAsstResponseData } from "~/lib/.server/openai/getAsstResponseData";
import { NEW_GAME_PROMPT } from "~/lib/.server/openai/prompts";
import { requireThread } from "~/lib/.server/openai/requireThread";
import { redisCache } from "~/lib/.server/redis/redis";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/games.$id";

const NO_GAME_FOUND_ERROR = "Sorry, no game found.";
type GameView = "question" | "answer" | "end";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Trivia Game Demo" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect(`/?error=${encodeURIComponent(NO_GAME_FOUND_ERROR)}`);
  }

  const payload = await redisCache.get<AssistantPayload | null>(params.id);

  if (!payload) {
    throw redirect(`/?error=${encodeURIComponent(NO_GAME_FOUND_ERROR)}`);
  }
  return {
    id: params?.id,
    game: payload.game,
  };
}

// TODO: use for new game after first game, maybe single resource route for both first and additional games
export async function action({ request, params }: Route.ActionArgs) {
  let threadId: string = "";

  const currentGame = await redisCache.get<AssistantPayload | null>(params.id);
  console.log("currentGame: ", currentGame);

  if (currentGame && currentGame?.threadId) {
    threadId = currentGame?.threadId;
  } else {
    const thread = await requireThread({
      prompt: NEW_GAME_PROMPT,
    });
    threadId = thread.id;
  }
  console.log("threadId: ", threadId);

  const asstResponse = await getAsstResponseData({
    asstId: ENV.OPENAI_ASST_ID_CREATE_GAME,
    threadId,
  });
  const id = generateId();

  await redisCache.set<string>(
    id,
    JSON.stringify({
      game: asstResponse,
      threadId,
    } satisfies AssistantPayload)
  );

  return redirect(`/games/${id}`);
}

export default function GameDetails({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isNavigating = Boolean(navigation.location);
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

  function playAgain() {
    setCorrectAnswers(0);
    setSelectedChoice("");
    setQuestionIndex(0);
    setCurrentView("question");
  }

  useEffect(() => {
    playAgain();
  }, [location.pathname]);

  const gameViews: Record<GameView, JSX.Element> = {
    question: (
      <div>
        <div>
          Question {questionIndex + 1} of {game?.questions.length}
          <h2>{currentQuestion?.question}</h2>
        </div>
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
          className="btn"
        >
          Submit Answer
        </button>
      </div>
    ),
    answer: (
      <div>
        <div className="text-slate-500">
          Question {questionIndex + 1} of {game?.questions.length}
          <h2>{currentQuestion?.question}</h2>
        </div>
        <p>Your answer: {selectedChoice}</p>
        <p>
          {currentQuestion?.correctAnswer === selectedChoice
            ? "Correct answer!"
            : `Sorry, the correct answer is: ${currentQuestion?.correctAnswer}.`}
        </p>
        <p>
          <button onClick={handleNext} className="btn">
            {questionIndex === game?.questions.length - 1
              ? "Continue"
              : "Next Question"}
          </button>
        </p>
      </div>
    ),
    end: (
      <div>
        <h1>Results</h1>
        <p>Correct answers: {correctAnswers}</p>
        <p>
          <button onClick={playAgain} className="btn">
            Play Again
          </button>
        </p>
        <div>
          <Form method="post">
            <button
              type="submit"
              disabled={isNavigating}
              className={twMerge("btn disabled:btn-disabled")}
            >
              {isNavigating ? "Creating game..." : "New Trivia Game"}
            </button>
          </Form>
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
