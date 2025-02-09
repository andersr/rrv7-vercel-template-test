import { zodResponseFormat } from "openai/helpers/zod";
import type { AssistantName } from "~/.server/assistants/names";
import { openai } from "~/.server/openai/openai";
import type { AsstConfig } from "~/types/assistant";
import type { NodeEnv } from "~/types/env";

export async function updateAssistant({
  id,
  config,
  name,
  env,
}: {
  id: string;
  config: AsstConfig;
  name: AssistantName;
  env: NodeEnv;
}) {
  await openai.beta.assistants.update(id, {
    instructions: config.instructions,
    description: config.description,
    response_format: zodResponseFormat(config.schema, `${name}_schema`),
  });
  console.info(`${name} ${env} asst updated`);
}
