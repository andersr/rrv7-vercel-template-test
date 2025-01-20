import { Form, redirect, useNavigation } from "react-router";
import { ENV } from "~/lib/.server/ENV";
import { generateId } from "~/lib/.server/generateId";
import { getAsstResponseData } from "~/lib/.server/openai/getAsstResponseData";
import { NEW_GAME_PROMPT } from "~/lib/.server/openai/prompts";
import { requireThread } from "~/lib/.server/openai/requireThread";
import { redisCache } from "~/lib/.server/redis/redis";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/_index";

const title = "Structured Output Demo";

export function meta({}: Route.MetaArgs) {
  return [{ title }];
}

export async function action() {
  const thread = await requireThread({ prompt: NEW_GAME_PROMPT });
  const asstResponse = await getAsstResponseData({
    asstId: ENV.OPENAI_ASST_ID_CREATE_GAME,
    threadId: thread.id,
  });
  const id = generateId();

  await redisCache.set<string>(
    id,
    JSON.stringify({
      game: asstResponse,
      threadId: thread.id,
    } satisfies AssistantPayload),
    {
      ex: 60 * 60 * 24, // Expires in 24h
    }
  );

  return redirect(`/games/${id}`);
}

export default function Home() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div className="text-center">
      <h1>{title}</h1>
      <Form method="post">
        <button
          type="submit"
          disabled={isNavigating}
          className={"btn disabled:btn-disabled"}
        >
          {isNavigating ? "Creating game..." : "New Trivia Game"}
        </button>
      </Form>
      {isNavigating && (
        <div className="mt-4 text-sm text-secondary">
          This might take a moment...
        </div>
      )}
    </div>
  );
}
