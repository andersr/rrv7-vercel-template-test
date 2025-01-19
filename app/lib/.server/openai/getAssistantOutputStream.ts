import { openai } from './openai';

export interface CreateAssistantInput {
	instructions: string;
	name: string;
}

export interface AsstDataRequestInput {
	threadId: string;
	asstId: string;
}

// TODO: merge with getStreamingReply
export async function getAsstOutputStream({ threadId, asstId }: AsstDataRequestInput) {
	try {
		const stream = await openai.beta.threads.runs.create(threadId, {
			assistant_id: asstId,
			stream: true
		});

		const response = [];

		for await (const chunk of stream) {
			if (chunk.event === 'thread.message.delta') {
				const content = chunk.data.delta.content as {
					text: {
						value: string;
					};
				}[];
				// console.log("content: ", content);

				// console.log("content: ", content);
				if (content) {
					const text = content[0].text.value;
					response.push(text);
					// console.log(text);
					// process.stdout.write(content[0].text.value);
					// console.log(content[0].text.value);
				}
			}
		}

		const output = response.join('');

		return output;
	} catch (error) {
		console.error('ERROR: ', error);
		return '';
	}
}
