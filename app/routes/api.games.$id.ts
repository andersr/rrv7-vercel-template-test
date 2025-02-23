import { redirect } from "react-router";
import { redisStore } from "~/.server/redis/redis";
import { ERROR_PARAM } from "~/shared/params";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/api.games.$id";

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
