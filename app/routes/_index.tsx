import { Form, redirect, useNavigation } from "react-router";
import { ENV } from "~/lib/.server/ENV";
import { generateId } from "~/lib/.server/generateId";
import { getAsstResponseData } from "~/lib/.server/openai/getAsstResponseData";
import { NEW_GAME_PROMPT } from "~/lib/.server/openai/prompts";
import { redisCache } from "~/lib/.server/redis/redis";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const asstResponse = await getAsstResponseData({
    prompt: NEW_GAME_PROMPT,
    asstId: ENV.OPENAI_ASST_ID_CREATE_GAME,
  });
  const id = generateId();

  await redisCache.set<string>(id, JSON.stringify(asstResponse), {
    // ex: 60 * 60, // TODO: add expiration
  });

  return redirect(`/games/${id}`);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <main className="p-4">
      <h1>Trivia Game Demo</h1>
      <Form method="post">
        <button
          type="submit"
          disabled={isNavigating}
          className="border border-slate-300 rounded p-2 disabled:text-opacity-50"
        >
          {isNavigating ? "Creating game..." : "New Trivia Game"}
        </button>
      </Form>
    </main>
  );
}
