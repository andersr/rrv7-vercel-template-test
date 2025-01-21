import { redirect } from "react-router";
import { ENV } from "~/lib/.server/ENV";
import { generateId } from "~/lib/.server/generateId";
import { getAsstOutput } from "~/lib/.server/openai/getAssistantOutput";
import { NEW_GAME_PROMPT } from "~/lib/.server/openai/prompts";
import { requireThread } from "~/lib/.server/openai/requireThread";
import { redisCache } from "~/lib/.server/redis/redis";
import type { AssistantPayload } from "~/types/assistant";
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
  const thread = await requireThread({ prompt: NEW_GAME_PROMPT });
  const output = await getAsstOutput({
    asstId: ENV.OPENAI_ASST_ID_CREATE_GAME,
    threadId: thread.id,
  });
  const id = generateId();

  await redisCache.set<string>(
    id,
    JSON.stringify({
      game: output,
      threadId: thread.id,
    } satisfies AssistantPayload),
    {
      ex: 60 * 60 * 24, // Expires in 24h
    }
  );

  return redirect(`/games/${id}`);
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
