import { redirect } from "react-router";
import { getAsstOutput } from "~/.server/openai/getAssistantOutput";
import { CREATE_GAME_PROMPT } from "~/.server/openai/prompts";
import { redisStore } from "~/.server/redis/redis";
import { generateId } from "~/.server/utils/generateId";
import { requireAsstIds } from "~/.server/utils/requireAsstIds";
import { requireEnv } from "~/.server/utils/requireEnv";
import { requireThread } from "~/.server/utils/requireThread";
import { triviaGameSchema } from "~/lib/gameSchema";
import { ERROR_PARAM } from "~/shared/params";
import type { AssistantPayload } from "~/types/assistant";
import NewGameForm from "~/ui/NewGameForm";
import type { Route } from "./+types/_index";

const title = "Structured Output Demo";

export function meta({}: Route.MetaArgs) {
  return [{ title }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get(ERROR_PARAM);

  return {
    errorMessage: error ? "Sorry, something went wrong. Please try again." : "",
  };
}

export async function action() {
  try {
    const thread = await requireThread({ prompt: CREATE_GAME_PROMPT });
    const env = requireEnv();
    const asstIds = await requireAsstIds("createTriviaGame");

    const output = await getAsstOutput({
      asstId: asstIds[env],
      threadId: thread.id,
    });

    const game = triviaGameSchema.parse(output);

    const id = generateId();

    await redisStore.set<AssistantPayload>(
      id,
      {
        game,
        threadId: thread.id,
      },
      {
        ex: 60 * 60 * 24, // Expires in 24h
      }
    );

    return redirect(`/games/${id}`);
  } catch (error) {
    console.error("error: ", error);
    return {
      error: "Sorry, something went wrong.",
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="text-center">
      {loaderData.errorMessage && (
        <div className="py-4 text-red-500">{loaderData.errorMessage}</div>
      )}
      <h1>{title}</h1>
      <NewGameForm />
    </div>
  );
}
