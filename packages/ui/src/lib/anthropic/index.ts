import { SerializedGraph } from '@tokens-studio/graph-engine';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229';

const client = new Anthropic({
	apiKey: ANTHROPIC_API_KEY // This is the default and can be omitted
});

export const summarizeGraph = async (graph: SerializedGraph) => {
	const message = await client.messages.create({
		max_tokens: 4096,
		messages: [
			{
				role: 'user',
				content:
					'You are responsible for summarizing dataflow graphs in a way that is understandable to humans. This is a critical task that requires a deep understanding of the dataflow graph and the ability to communicate complex ideas in a clear and concise manner. Your summary should provide a high-level overview of the dataflow graph, highlighting key components and relationships between them. It should also include any important insights or observations that can be drawn from the dataflow graph. Remember that your summary will be used by others to quickly understand the dataflow graph, so make sure it is accurate, informative, and easy to read. '
			},
			{ role: 'assistant', content: 'Understood' },
			{ role: 'user', content: '```' + JSON.stringify(graph) + '```' }
		],
		model: ANTHROPIC_MODEL
	});

	return message.content[0].text;
};
