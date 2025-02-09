import { redirect } from "react-router";
import { getAsstOutput } from "~/.server/openai/getAssistantOutput";
import { CREATE_GAME_PROMPT } from "~/.server/openai/prompts";
import { requireThread } from "~/.server/openai/requireThread";
import { redisStore } from "~/.server/redis/redis";
import { generateId } from "~/.server/utils/generateId";
import type { AssistantName } from "~/lib/assistantNames";
import { triviaGameSchema } from "~/lib/gameSchema";
import type { AssistantPayload, AsstIdStore } from "~/types/assistant";
import type { NodeEnv } from "~/types/env";
import NewGameForm from "~/ui/NewGameForm";
import type { Route } from "./+types/_index";

const title = "Structured Output Demo";

export function meta({}: Route.MetaArgs) {
  return [{ title }];
}

export async function loader({ request }: Route.LoaderArgs) {
  let errorMessage = "";
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) {
    errorMessage = "Sorry, something went wrong. Please try again.";
  }

  return {
    errorMessage,
  };
}

export async function action() {
  try {
    const thread = await requireThread({ prompt: CREATE_GAME_PROMPT });

    // TODO: turn into requireEnv
    const env = process.env.NODE_ENV as NodeEnv;
    if (!env) {
      throw new Error("no node env found");
    }
    const asstName = "createTriviaGame" satisfies AssistantName;

    const asstIds = await redisStore.get<AsstIdStore>(asstName);

    if (!asstIds) {
      throw new Error("No assistant ids found.");
    }

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
