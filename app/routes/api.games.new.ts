import { getAsstOutput } from "~/.server/openai/getAssistantOutput";
import { openai } from "~/.server/openai/openai";
import { redisStore } from "~/.server/redis/redis";
import { generateId } from "~/.server/utils/generateId";
import { requireAsstIds } from "~/.server/utils/requireAsstIds";
import { requireEnv } from "~/.server/utils/requireEnv";
import { requireThread } from "~/.server/utils/requireThread";
import {
  ANOTHER_GAME_PROMPT,
  CREATE_GAME_PROMPT,
} from "~/lib/triviaGame/prompts";
import { triviaGameSchema } from "~/lib/triviaGame/schemas";
import { THREAD_ID_PARAM } from "~/shared/params";
import type { AssistantPayload } from "~/types/assistant";
import type { Route } from "./+types/api.games.new";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    let threadId = url.searchParams.get(THREAD_ID_PARAM);

    if (threadId) {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: ANOTHER_GAME_PROMPT,
      });
    } else {
      const thread = await requireThread({ prompt: CREATE_GAME_PROMPT });
      threadId = thread.id;
    }

    const asstIds = await requireAsstIds("createTriviaGame");
    const env = requireEnv();

    const output = await getAsstOutput({
      asstId: asstIds[env],
      threadId,
    });

    const game = triviaGameSchema.parse(output);

    const id = generateId();

    await redisStore.set<AssistantPayload>(
      id,
      {
        game,
        threadId,
      },
      {
        ex: 60 * 60 * 24, // Expires in 24h
      }
    );

    return {
      id,
      game,
    };
  } catch (error) {
    console.error("error: ", error);
    return {
      error: "Sorry, something went wrong.",
    };
  }
}
