// import { AssistantKey } from "./asstKeys";
// import { AsstConfig } from "./types";

import type { AssistantId } from "~/asstIds";
import type { AsstConfig } from "~/types/assistant";

export const asstConfigCollection: Record<AssistantId, AsstConfig> = {
  createTriviaGame: {
    instructions: `You are a home maintenance expert. You specialize in providing advice regarding the upkeep of a home. Provide your response in JSON format.`,
    description:
      "Used to generate suggested home features and maintenance tasks based on a property type",
    key: "createTriviaGame", // needed?
  },
};
