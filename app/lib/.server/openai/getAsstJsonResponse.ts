// import type {
// 	HomeMaintenanceAsstReponse,
// 	AsstCostEstimateResponse
// } from '../../../types/assistant';
// import { redisCache } from '../redis/redis';
// import { asstCache } from "./asstCache.server";
import type { TriviaGame } from "~/types/game";
import { getAsstResponseData } from "./getAsstResponseData";

export interface AsstQueryInput {
  prompt: string;
  asstId: string;
  cachedResponseKey: string;
}

export type getAsstJsonResponseFn<T> = (
  input: AsstQueryInput
) => Promise<T | null>;

type AsstResponses = TriviaGame;

export const ASST_RESPONSE_PREFIX = "ASST_RESPONSE_";

// TODO: unused?
export const getAsstJsonResponse: getAsstJsonResponseFn<
  AsstResponses
> = async ({ prompt, asstId, cachedResponseKey }) => {
  try {
    if (!cachedResponseKey) {
      return await getAsstResponseData({ asstId, prompt });
    }

    // const cachedResponse = await redisCache.get<AsstResponses>(cachedResponseKey);
    // if (cachedResponse) {
    // 	return cachedResponse;
    // }

    const data = await getAsstResponseData({ asstId, prompt });
    // await redisCache.set<string>(
    // 	cachedResponseKey,
    // 	JSON.stringify(data),
    // 	{ ex: 60 * 60 } // expire in 1 hour
    // );

    return data;
  } catch (error) {
    console.error("error: ", error);
    return null; // for now
  }
};

// async function getAsstResponseData({ prompt, asstId }: { prompt: string; asstId: string }) {
// 	const thread = await requireThread({
// 		prompt
// 	});
// 	const output = await getAsstOutputStream({
// 		asstId,
// 		threadId: thread.id
// 	});

// 	return JSON.parse(output);
// }
