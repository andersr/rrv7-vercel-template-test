import type { AssistantName } from "~/.server/assistants/names";
import type { AsstIdStore } from "~/types/assistant";
import { redisStore } from "../redis/redis";

export async function requireAsstIds(asstName: AssistantName) {
  const ids = await redisStore.get<AsstIdStore>(asstName);

  if (!ids) {
    throw new Error("No assistant ids found.");
  }

  return ids;
}
