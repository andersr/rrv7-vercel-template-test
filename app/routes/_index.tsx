import { Form, redirect, useNavigation } from "react-router";
import { twMerge } from "tailwind-merge";
import { ENV } from "~/lib/.server/ENV";
import { generateId } from "~/lib/.server/generateId";
import { getAsstResponseData } from "~/lib/.server/openai/getAsstResponseData";
import { NEW_GAME_PROMPT } from "~/lib/.server/openai/prompts";
import { requireThread } from "~/lib/.server/openai/requireThread";
import { redisCache } from "~/lib/.server/redis/redis";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/_index";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trivia Game Demo" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

// export function loader({ context }: Route.LoaderArgs) {
//   return {};
// }

export async function action({ request }: Route.ActionArgs) {
  const thread = await requireThread({ prompt: NEW_GAME_PROMPT });
  const asstResponse = await getAsstResponseData({
    asstId: ENV.OPENAI_ASST_ID_CREATE_GAME,
    threadId: thread.id,
  });
  const id = generateId();

  // TODO: store threadId and response
  await redisCache.set<string>(
    id,
    JSON.stringify({
      game: asstResponse,
      threadId: thread.id,
    } satisfies AssistantPayload),
    {
      // ex: 60 * 60, // TODO: add expiration
    }
  );

  return redirect(`/games/${id}`);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div>
      <h1>Trivia Game Demo</h1>
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
  );
}
