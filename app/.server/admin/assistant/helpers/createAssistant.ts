import { zodResponseFormat } from "openai/helpers/zod";
import type { AssistantName } from "~/.server/assistants/names";
import { openai } from "~/.server/openai/openai";
import type { AsstConfig } from "~/types/assistant";
import type { NodeEnv } from "~/types/env";

export async function createAssistant({
  config,
  name,
  env,
}: {
  config: AsstConfig;
  name: AssistantName;
  env: NodeEnv;
}) {
  const asst = await openai.beta.assistants.create({
    ...config,
    name: `${name}_${env}`,
    response_format: zodResponseFormat(config.schema, `${name}_schema`),
  });

  console.info(`Asst created in OpenAI: name: ${asst.name}, id: ${asst.id}`);

  return asst;
}
