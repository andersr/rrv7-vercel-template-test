import { getAsstOutputStream } from "./getAssistantOutputStream";

export async function getAsstResponseData({
  asstId,
  threadId,
}: {
  asstId: string;
  threadId: string;
}) {
  const output = await getAsstOutputStream({
    asstId,
    threadId,
  });

  return JSON.parse(output);
}
