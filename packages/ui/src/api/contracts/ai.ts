import { SerializedGraph } from '../schemas/graph.ts';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const aiContract = c.router({
	getAISummary: {
		method: 'POST',
		path: '/ai/summarize',
		body: z.object({
			graph: SerializedGraph
		}),
		responses: {
			200: z.object({
				summary: z.string()
			})
		}
	}
});
