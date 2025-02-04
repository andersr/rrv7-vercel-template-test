import type { AssistantId } from "~/asstIds";
// import { Form, useLoaderData } from "react-router";
// import { prisma } from "~/.server/db/prisma";
// import { asstConfigCollection } from "~/.server/openai/asstConfig";
// import { ASSISTANT_KEYS, AssistantKey } from "~/.server/openai/asstKeys";
// import { openai } from "~/.server/openai/openai";
// import { AdminButton } from "~/components/admin/AdminButton";
// import { AdminHeading } from "~/components/admin/AdminHeading";
// import { AdminSection } from "~/components/admin/AdminSection";
// import { homeFeaturesSchema } from "~/lib/newHome/schemas";
// import { Route } from "./+types/admin.assistants";

// import { type AsstistantId } from "~/asstIds";

const TITLE = "Assistants";

export function meta() {
  return [
    {
      title: TITLE,
    },
  ];
}
// { request }: Route.LoaderArgs
export async function loader() {
  // const dbAssistants = await prisma.assistant.findMany({
  //   where: {
  //     key: {
  //       in: ASSISTANT_KEYS.map((k) => k), // convert readonly string[] to string[]
  //     },
  //   },
  // });

  // const asstIds = dbAssistants.map((d) => d.oaiId);

  // const allAssistants = await openai.beta.assistants.list({ order: "desc" });

  // TODO: also validate based on asst metadata?
  // const assistants = allAssistants.data.filter((a) => asstIds.includes(a.id));

  return {
    // assistants,
  };
}

export default function AsstAdmin() {
  // const { assistants } = useLoaderData<typeof loader>();
  return <div></div>;
}
// { request, params }: Route.ActionArgs
export async function action() {
  try {
    const asstKey = "createTriviaGame" satisfies AssistantId;
    const env = process.env.NODE_ENV;
    // const config = asstConfigCollection[asstKey];

    // if (!config) {
    //   throw new Error(`No config found for: ${asstKey}`);
    // }

    // const asstDb = await prisma.assistant.findUnique({
    //   where: { key: asstKey },
    // });

    // if (asstDb) {
    //   await openai.beta.assistants.update(asstDb.oaiId, {
    //     instructions: config.instructions,
    //     description: config.description,
    //     response_format: zodResponseFormat(
    //       triviaGameSchema,
    //       `${asstKey}_schema`
    //     ),
    //   });
    //   return;
    // }

    // create assistant
    // const newAsst = await openai.beta.assistants.create({
    //   model: "gpt-4o-mini",
    //   instructions: config.instructions,
    //   description: config.description,
    //   name: `${asstKey}_${env}`,
    //   response_format: zodResponseFormat(triviaGameSchema, `${asstKey}_schema`),
    //   metadata: {
    //     asstKey,
    //   }, // TODO:needs to be typed
    // });

    // await prisma.assistant.create({
    //   data: {
    //     key: asstKey,
    //     oaiId: newAsst.id,
    //   },
    // });

    return {};
  } catch (error) {
    console.error("error: ", JSON.stringify(error));
    return {};
  }
}
