import { ErrorResponse } from '../utils/common.ts';
import { SerializedGraph } from '../schemas/graph.ts';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const graphContract = c.router({
	listGraphs: {
		summary: 'Lists all graphs a user owns',
		method: 'GET',
		path: '/graph',

		query: z.object({
			take: z.number().lte(50).gte(1).optional().default(10),
			skip: z.number().gte(0).optional().default(0),
			token: z.string().optional().describe('The token to use for pagination')
		}),

		responses: {
			200: z.object({
				graphs: z.array(
					z.object({
						name: z.string(),
						id: z.string(),
						graph: SerializedGraph,
						updatedAt: z.number(),
						public: z.boolean()
					})
				),
				token: z.string().optional()
			})
		}
	},

	getGraph: {
		summary: 'Retrieves a specific graph',
		method: 'GET',
		path: '/graph/:id',
		pathParams: z.object({
			id: z.string()
		}),
		responses: {
			200: z.object({
				name: z.string(),
				id: z.string(),
				description: z.string().optional(),
				graph: SerializedGraph,
				updatedAt: z.number(),
				public: z.boolean()
			}),
			403: ErrorResponse,
			400: z.any()
		}
	},
	deleteGraph: {
		summary: 'Deletes a specific graph',
		method: 'DELETE',
		path: '/graph/:id',
		pathParams: z.object({
			id: z.string()
		}),
		body: z.object({}).strict().optional(),
		responses: {
			200: z.object({
				id: z.string()
			}),
			404: ErrorResponse
		}
	},
	createGraph: {
		method: 'POST',
		path: '/graph/',
		body: z.object({
			name: z.string(),
			graph: SerializedGraph
		}),
		responses: {
			201: z.object({
				id: z.string()
			})
		}
	},
	updateGraph: {
		method: 'PUT',
		path: '/graph/:id',
		pathParams: z.object({
			id: z.string()
		}),
		body: z.object({
			name: z.string().optional(),
			graph: SerializedGraph.optional(),
			public: z.boolean().optional(),
			description: z.string().optional()
		}),
		responses: {
			200: z.object({
				id: z.string()
			}),
			404: ErrorResponse
		}
	}
});
