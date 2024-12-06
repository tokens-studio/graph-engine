import { Context } from '../utils/types.ts';
import { Prisma } from '@prisma/client';
import { authMiddleware } from '../middleware.ts/auth.ts';
import { graphContract } from '../contracts/graph.ts';
import { prisma } from '@/lib/prisma/index.ts';
import { tsr } from '@ts-rest/serverless/next';
import { withCursor } from '../utils/common.ts';

export const router = tsr.router<typeof graphContract, Context>(graphContract, {
	listGraphs: {
		middleware: [authMiddleware],
		handler: async ({ query }, { request }) => {
			const owner = request.user;

			const cursorAdd = withCursor(query.token);

			const graphs = await prisma.graph.findMany({
				take: query.take,
				skip: query.skip,
				where: {
					owner: owner ?? null
				},
				select: {
					name: true,
					id: true,
					graph: true,
					updatedAt: true,
					public: true
				},
				orderBy: {
					updatedAt: 'desc'
				},
				...cursorAdd
			});

			const token =
				graphs.length > 0 ? graphs[graphs.length - 1].id : undefined;

			return {
				status: 200 as const,
				body: {
					token,
					graphs: graphs.map(g => {
						return {
							id: g.id,
							name: g.name,
							graph: g.graph as any,
							updatedAt: g.updatedAt.getTime(),
							public: g.public
						};
					})
				}
			};
		}
	},
	createGraph: {
		middleware: [authMiddleware],
		handler: async ({ body }, { request }) => {
			const { name, graph } = body;

			const owner = request.user;
			const newGraph = await prisma.graph.create({
				data: {
					name: name,
					graph: graph as unknown as string,
					owner
				}
			});

			return {
				status: 201,
				body: {
					id: newGraph.id
				}
			};
		}
	},

	getGraph: {
		middleware: [authMiddleware],
		handler: async ({ params }, { request }) => {
			const { id } = params;
			const owner = request.user;

			const graph = await prisma.graph.findFirst({
				where: {
					id
				}
			});

			if (!graph) {
				return {
					status: 400,
					body: {
						message: 'Entity not found'
					}
				};
			}

			//Check if the user is the owner of the graph

			if (graph.owner !== owner && graph.public !== true) {
				return {
					status: 403,
					body: {
						message: 'Forbidden'
					}
				};
			}

			return {
				status: 200,
				body: {
					id: graph.id,
					name: graph.name,
					description: graph.description,
					graph: graph.graph as any,
					updatedAt: graph.updatedAt.getTime(),
					public: graph.public
				}
			};
		}
	},
	deleteGraph: {
		middleware: [authMiddleware],
		handler: async ({ params }, { request }) => {
			const { id } = params;
			const owner = request.user;
			try {
				await prisma.graph.delete({
					where: {
						id,
						owner
					}
				});
			} catch (err) {
				if (err instanceof Prisma.PrismaClientKnownRequestError) {
					if (err.code === 'P2025') {
						return {
							status: 404,
							body: {
								message: 'Entity not found'
							}
						};
					}
				}
				throw err;
			}
			return {
				status: 200,
				body: {
					id
				}
			};
		}
	},
	updateGraph: {
		middleware: [authMiddleware],
		handler: async ({ body, params }, { request }) => {
			const { id } = params;
			const { name, graph, description, public: IsPublic } = body;

			const data = {};

			if (name) {
				data['name'] = name;
			}
			if (graph) {
				data['graph'] = graph;
			}

			if (description) {
				data['description'] = description;
			}

			if (IsPublic) {
				data['public'] = IsPublic;
			}

			const owner = request.user;
			try {
				await prisma.graph.update({
					where: {
						id,
						owner
					},
					data
				});

				return {
					status: 200,
					body: {
						id
					}
				};
			} catch (err) {
				if (err instanceof Prisma.PrismaClientKnownRequestError) {
					if (err.code === 'P2025') {
						return {
							status: 404,
							body: {
								message: 'Entity not found'
							}
						};
					}
				}
				throw err;
			}
		}
	}
});
