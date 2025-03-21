import { Langfuse } from 'langfuse';
import { type SerializedGraph, annotatedId } from '@tokens-studio/graph-engine';
import { v4 as uuid } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import type { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229';
const LANGFUSE_ENVIRONMENT = (
	process.env.LANGFUSE_ENVIRONMENT || 'production'
).split(',');
const MAX_TOKENS = Number.parseInt(process.env.MAX_TOKENS || '4096');

const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY;
const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY;
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL;

const client = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const langfuse = new Langfuse({
	secretKey: LANGFUSE_SECRET_KEY,
	publicKey: LANGFUSE_PUBLIC_KEY,
	baseUrl: LANGFUSE_BASE_URL
});

export const summarizeGraph = async (
	graph: SerializedGraph,
	userId?: string
) => {
	const trace = langfuse.trace({
		name: 'summarize-graph',
		sessionId: uuid(),
		tags: LANGFUSE_ENVIRONMENT,
		metadata: {
			graphID: graph.annotations[annotatedId]
		},
		userId
	});

	const promptSpan = trace.span({
		name: 'retrieve-prompt'
	});
	const prompt = await langfuse.getPrompt('summarize-graph');
	promptSpan.end();

	const compiledPrompt = prompt.compile({
		content: '```' + JSON.stringify(graph) + '```'
	});

	const span = trace.span({
		name: 'summarize-graph'
	});

	const messages = [
		{
			role: 'user',
			content: compiledPrompt
		}
	];

	// Example generation creation
	const generation = span.generation({
		prompt: prompt,
		name: 'chat-completion',
		model: ANTHROPIC_MODEL,
		modelParameters: {
			maxTokens: MAX_TOKENS
		},
		input: compiledPrompt
	});

	const message = await client.messages.create({
		max_tokens: MAX_TOKENS,
		messages: messages as any,
		model: ANTHROPIC_MODEL
	});

	generation.end({
		output: message
	});
	span.end();

	return (message.content[0] as TextBlock).text;
};
