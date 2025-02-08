import { openai } from "~/lib/.server/openai/openai";
import { assistantConfigs } from "~/lib/assistantConfigs";
import { ASSISTANT_NAMES, type AssistantName } from "~/lib/assistantNames";
import type { AsstConfig, AsstIdStore } from "~/types/assistant";
import type { NodeEnv } from "~/types/env";
import { redisStore } from "../lib/.server/redis/redis";
import { updateAssistant } from "./helpers/updateAssistant.server";

type AsstAction = "create" | "update";

interface ActionHandlerInput {
  idStore: AsstIdStore | null;
  asstName: AssistantName;
  config: AsstConfig;
  env?: NodeEnv;
}

type asstHandlerFn = (input: ActionHandlerInput) => Promise<void>;

// TODO: update this to first retrieve existing assistants and throw an error if an assistant by the same name already exists
/**
 * Creates new assistants in OpenAI, one for dev, one for prod, and returns the OpenAI ids for each assistant. Run at project start, or whenever a new assistant is added.
 */
const create: asstHandlerFn = async ({ asstName, config }) => {
  try {
    const devName = `${asstName}_dev`;
    const dev = await openai.beta.assistants.create({
      ...config,
      name: devName,
    });
    console.info(
      `Dev asst created in OpenAI: name: ${devName} , id: ${dev.id}`
    );

    const prodName = `${asstName}_prod`;
    const prod = await openai.beta.assistants.create({
      ...config,
      name: prodName,
    });
    console.info(
      `Prod asst created in OpenAI: name: ${prodName} , id: ${prod.id}`
    );

    await redisStore.set<AsstIdStore>(asstName, {
      development: dev.id,
      production: prod.id,
    });
    console.info(`Asst ids added to store using key: ${asstName}`);
  } catch (error) {
    console.error("error: ", error);
    throw new Error("something went wrong creating assistants.");
  }
};

/**
 * Update the dev assistant only or both dev and prod. See commands in package.json.
 */
const update: asstHandlerFn = async ({ idStore, asstName, config, env }) => {
  try {
    if (!idStore?.development) {
      throw new Error("no dev asst id");
    }

    await updateAssistant({
      id: idStore.development,
      config,
      name: asstName,
      env: "development",
    });

    if (env === "production") {
      if (!idStore?.production) {
        throw new Error("no prod asst id");
      }
      await updateAssistant({
        id: idStore.production,
        config,
        name: asstName,
        env: "production",
      });
    }
  } catch (error) {
    console.error("error: ", error);
    throw new Error("something went wrong creating assistants.");
  }
};

const handlers: Record<AsstAction, asstHandlerFn> = {
  create,
  update,
};

/**
 * The main admin function. Run using scripts in package.json
 */
(async function asstAdmin() {
  try {
    const action = process.env.ACTION as AsstAction;
    const env = process.env.NODE_ENV as NodeEnv;

    if (!action) {
      throw new Error("no action found");
    }

    const handler = handlers[action];
    if (!handler) {
      throw new Error(`no matching handler found for action: ${action}`);
    }

    for (let index = 0; index < ASSISTANT_NAMES.length; index++) {
      const asstName = ASSISTANT_NAMES[index];
      const config = assistantConfigs[asstName];

      if (!config) {
        throw new Error(`No config found for: ${asstName}`);
      }

      const idStore = await redisStore.get<AsstIdStore | null>(asstName);

      await handler({ env, config, asstName, idStore });
    }
  } catch (error) {
    console.error("error: ", JSON.stringify(error));
  }
})();

// prevent global scope pollution
export {};
