import { AppRouteMutation, AppRouteQuery } from '@ts-rest/core';
import { SerializedGraph } from '../schemas/graph.ts';
import { z } from 'zod';

export const aiContract: Record<string, AppRouteMutation | AppRouteQuery> = {
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
};
