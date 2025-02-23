import { redisStore } from "~/.server/redis/redis";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/api.store.$id";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    if (!params.id) {
      throw new Error("no id param");
    }

    const payload = await redisStore.get<AssistantPayload | null>(params.id);

    if (!payload) {
      throw new Error("no payload");
    }

    return {
      id: params?.id,
      game: payload.game,
    };
  } catch (error) {
    console.error("error: ", error);
    return {
      error: "Sorry, something went wrong.",
    };
  }
}
