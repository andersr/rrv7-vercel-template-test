import OpenAI from "openai";
import { ENV } from "~/lib/.server/ENV";

export const openai = new OpenAI({
  apiKey: ENV.OPEN_AI_API_KEY,
});

export const ASST_NAMES = ["createGame"] as const;

export type AsstNames = (typeof ASST_NAMES)[number];

// const ASSISSTANT_IDS: Record<AsstNames, string> = {
//   createGame: ''
// };

// export const setAssistantIds: (name: AsstNames) => string = (name) => {

// 	const src = OPENAI_ASST_IDS.split(',').map((id) => id.split(':'));

// 	for (let index = 0; index < ASST_NAMES.length; index++) {
// 		if (src[index][0] === ASST_NAMES[index]) {
// 			ids[ASST_NAMES[index]] = src[index][1];
// 		}
// 	}
// };
