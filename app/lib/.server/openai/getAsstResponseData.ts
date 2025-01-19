import { getAsstOutputStream } from './getAssistantOutputStream';
import { requireThread } from './requireThread';

export async function getAsstResponseData({ prompt, asstId }: { prompt: string; asstId: string }) {
	const thread = await requireThread({
		prompt
	});
	const output = await getAsstOutputStream({
		asstId,
		threadId: thread.id
	});

	return JSON.parse(output);
}
