import { SerializedGraph } from '../schemas/graph.ts';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const marketplaceContract = c.router({
	publishGraph: {
		summary: 'Publishes a graph to the marketplace',
		method: 'POST',
		path: '/marketplace/graph/publish/:id',
		contentType: 'multipart/form-data',
		pathParams: z.object({
			id: z.string()
		}),
		body: c.type<{
			thumbnail?: File;
			name: string;
			description: string;
		}>(),
		responses: {
			201: z.object({
				id: z.string()
			})
		}
	},
	getGraph: {
		summary: 'Gets a graphs metadata',
		method: 'GET',
		path: '/marketplace/graph/:id/meta',
		pathParams: z.object({
			id: z.string()
		}),
		responses: {
			200: z.object({
				name: z.string(),
				id: z.string(),
				likes: z.number(),
				description: z.string().nullable(),
				versions: z.number(),
				downloads: z.number(),
				thumbnail: z.string().nullable(),
				user: z.object({
					id: z.string(),
					name: z.string(),
					image: z.string().nullable()
				}),
				createdAt: z.number()
			})
		}
	},
	retrieveGraph: {
		summary: 'Retrieves a graph',
		method: 'GET',
		path: '/marketplace/graph/:id/graph',
		pathParams: z.object({
			id: z.string()
		}),
		responses: {
			200: z.object({
				id: z.string(),
				graph: SerializedGraph,
				version: z.string()
			})
		}
	},
	likeGraph: {
		summary: 'Likes a graph',
		method: 'POST',
		path: '/marketplace/graph/:id/like',
		pathParams: z.object({
			id: z.string()
		}),
		body: z.object({}),
		responses: {
			200: z.object({})
		}
	},
	searchGraphs: {
		summary: 'Searches through marketplace graphs ',
		method: 'GET',
		path: '/marketplace/graphs/search',

		query: z.object({
			name: z.string(),
			take: z.number().lte(20).gte(1).optional().default(10),
			skip: z.number().gte(0).optional().default(0),
			token: z.string().optional().describe('The token to use for pagination')
		}),

		responses: {
			200: z.object({
				graphs: z.array(
					z.object({
						name: z.string(),
						id: z.string(),
						description: z.string().nullable()
					})
				),
				token: z.string().optional()
			})
		}
	},
	listGraphs: {
		summary: 'Lists all public graphs ',
		method: 'GET',
		path: '/marketplace/graphs',

		query: z.object({
			containsText: z.string().optional(),
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
						likes: z.number(),
						versions: z.number(),
						downloads: z.number(),
						thumbnail: z.string().nullable(),
						user: z.object({
							id: z.string(),
							name: z.string(),
							image: z.string().nullable()
						}),
						createdAt: z.number()
					})
				),
				token: z.string().optional()
			})
		}
	},
	editGraph: {
		summary: 'Edits an existing graph',
		method: 'PUT',
		path: '/marketplace/graph/edit/:id',
		contentType: 'multipart/form-data',
		pathParams: z.object({
			id: z.string()
		}),
		body: c.type<{
			thumbnail?: File;
			name: string;
			description: string;
		}>(),
		responses: {
			200: z.object({})
		}
	},
	copyGraph: {
		summary: "Copies an available graph and adds it to the user's graphs",
		method: 'POST',
		path: '/marketplace/graph/:id/copy',
		pathParams: z.object({
			id: z.string()
		}),
		body: z.undefined(),
		responses: {
			201: z.object({
				id: z.string()
			})
		}
	}
});
