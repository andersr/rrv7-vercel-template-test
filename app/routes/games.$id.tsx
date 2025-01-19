import { useState, type JSX } from "react";
import { Link, redirect } from "react-router";
import { redisCache } from "~/lib/.server/redis/redis";
import type { TriviaGame } from "~/types/game";
import type { Route } from "./+types/games.$id";

const NO_GAME_FOUND_ERROR = "Sorry, no game found.";
export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect(`/?error=${encodeURIComponent(NO_GAME_FOUND_ERROR)}`);
  }

  const game: TriviaGame | null = await redisCache.get<TriviaGame | null>(
    params.id
  );

  if (!game) {
    throw redirect(`/?error=${encodeURIComponent(NO_GAME_FOUND_ERROR)}`);
  }
  return {
    id: params?.id,
    game,
  };
}

type GameView = "question" | "answer" | "end";

export default function GameDetails({ loaderData }: Route.ComponentProps) {
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

  const gameViews: Record<GameView, JSX.Element> = {
    question: (
      <div>
        <div>
          Question {questionIndex + 1} of {game?.questions.length}
          <h2>Category: {currentQuestion?.category}</h2>
          <h2>{currentQuestion?.question}</h2>
        </div>
        <ul>
          {currentQuestion?.choices.map((c) => (
            <li key={c}>
              <label>
                {c}{" "}
                <input
                  type="radio"
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
          className="border border-slate-300 rounded p-2 disabled:opacity-50 "
        >
          Submit Answer
        </button>
      </div>
    ),
    answer: (
      <div>
        <div>
          Question {questionIndex + 1} of {game?.questions.length}
          <h2>Category: {currentQuestion?.category}</h2>
          <h2>{currentQuestion?.question}</h2>
        </div>
        <p>Your answer: {selectedChoice}</p>
        <p>
          {currentQuestion?.correctAnswer === selectedChoice
            ? "Correct answer!"
            : `Sorry, the correct answer is: ${currentQuestion?.correctAnswer}.`}
        </p>
        <p>
          <button
            onClick={handleNext}
            className="border border-slate-300 rounded p-2"
          >
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
          <button
            onClick={playAgain}
            className="border border-slate-300 rounded p-2"
          >
            Play Again
          </button>
        </p>
        <p>
          <Link className="border border-slate-300 rounded p-2" to="/">
            New Game
          </Link>
        </p>
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
