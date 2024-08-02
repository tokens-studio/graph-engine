import { Context } from '../utils/types.ts';
import { Prisma } from '@prisma/client';
import { authMiddleware } from '../middleware.ts/auth.ts';
import { marketplaceContract } from '../contracts/marketplace.ts';
import { prisma } from '@/lib/prisma/index.ts';
import { randomUUID } from 'crypto';
import { tsr } from '@ts-rest/serverless/next';
import { withCursor } from '../utils/common.ts';

const FiveMeg = 5 * 1024 * 1024;

export const router = tsr.router<typeof marketplaceContract, Context>(
	marketplaceContract,
	{
		publishGraph: {
			middleware: [authMiddleware],
			handler: async ({ params }, { request }) => {
				const { id } = params;
				const formData = await request.formData();

				const name = (formData.get('name') as string).slice(1, -1);
				const description = (formData.get('description') as string).slice(
					1,
					-1
				);
				const thumbnailData = formData.get('thumbnail') as File | undefined;
				let bytes: Buffer | null = null;
				let extension: string | null = null;

				if (!name || !description) {
					return {
						status: 400,
						body: {
							message: 'Missing required fields'
						}
					};
				}

				if (thumbnailData && thumbnailData.size > FiveMeg) {
					return {
						status: 400,
						body: {
							message: 'Thumbnail is too large'
						}
					};
				}

				if (thumbnailData) {
					extension = thumbnailData.name.split('.').pop() || '';

					switch (extension) {
						case 'png':
						case 'jpg':
						case 'jpeg':
							break;
						default:
							return {
								status: 400,
								body: {
									message: 'Invalid thumbnail extension'
								}
							};
					}

					const arrBuffer = await thumbnailData.arrayBuffer();
					bytes = Buffer.from(arrBuffer);
				}

				const owner = request.user;
				//Read the graph from the database
				try {
					const rawGraph = await prisma.graph.findFirst({
						where: {
							id,
							owner
						}
					});

					if (!rawGraph?.graph) {
						return {
							status: 404,
							body: {
								message: 'Graph not found'
							}
						};
					}

					//We are going to duplicate this graph so that it doesn't break if the original changes. We'll track this as versions at a later point
					let thumbnail:
						| Prisma.ThumbnailCreateNestedOneWithoutPublishedGraphInput
						| undefined = undefined;

					if (thumbnailData && bytes) {
						const thumbnailID = randomUUID();
						thumbnail = {
							create: {
								id: thumbnailID,
								path: `/thumbnails/${thumbnailID}.${extension}`,
								extension: extension!,
								name: thumbnailData.name,
								type: thumbnailData.type,
								size: thumbnailData.size,
								data: bytes
							}
						};
					}

					const newGraph = await prisma.publishedGraph.create({
						data: {
							name: name,
							thumbnail,
							description: description,
							versions: {
								create: {
									graph: rawGraph?.graph,
									version: 0
								}
							},
							user: {
								connect: {
									id: owner
								}
							}
						}
					});

					return {
						status: 200,
						body: {
							id: newGraph.id
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
		},
		editGraph: {
			middleware: [authMiddleware],
			handler: async ({ params }, { request }) => {
				const { id } = params;
				const formData = await request.formData();

				const name = (formData.get('name') as string).slice(1, -1);
				const description = (formData.get('description') as string).slice(
					1,
					-1
				);
				const thumbnailData = formData.get('thumbnail') as File | undefined;
				let bytes: Buffer | null = null;
				let extension: string | null = null;

				if (thumbnailData && thumbnailData.size > FiveMeg) {
					return {
						status: 400,
						body: {
							message: 'Thumbnail is too large'
						}
					};
				}

				if (thumbnailData) {
					extension = thumbnailData.name.split('.').pop() || '';

					switch (extension) {
						case 'png':
						case 'jpg':
						case 'jpeg':
							break;
						default:
							return {
								status: 400,
								body: {
									message: 'Invalid thumbnail extension'
								}
							};
					}

					const arrBuffer = await thumbnailData.arrayBuffer();
					bytes = Buffer.from(arrBuffer);
				}

				const data = {};
				if (name) {
					data['name'] = name;
				}
				if (description) {
					data['description'] = description;
				}

				const owner = request.user;
				//Read the graph from the database
				try {
					const published = await prisma.publishedGraph.findFirst({
						where: {
							id,
							owner
						}
					});

					if (!published) {
						return {
							status: 404,
							body: {
								message: 'Graph not found'
							}
						};
					}

					let thumbnail:
						| Prisma.ThumbnailCreateNestedOneWithoutPublishedGraphInput
						| undefined = undefined;

					if (thumbnailData && bytes) {
						const thumbnailID = randomUUID();
						thumbnail = {
							create: {
								id: thumbnailID,
								path: `/thumbnails/${thumbnailID}.${extension}`,
								extension: extension!,
								name: thumbnailData.name,
								type: thumbnailData.type,
								size: thumbnailData.size,
								data: bytes
							}
						};

						data['thumbnail'] = thumbnail;
					}

					await prisma.publishedGraph.update({
						where: {
							id,
							owner
						},
						data
					});

					return {
						status: 200,
						body: {}
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
		},

		getGraph: async ({ params }) => {
			const { id } = params;
			const graph = await prisma.publishedGraph.findFirst({
				where: {
					id
				},
				select: {
					_count: {
						select: {
							versions: true
						}
					},
					user: true,
					name: true,
					id: true,
					thumbnail: true,
					description: true,
					owner: true,
					createdAt: true,
					likesTotal: true,
					downloadsTotal: true
				}
			});

			if (!graph) {
				return {
					status: 404,
					body: {
						message: 'Graph not found'
					}
				};
			}

			return {
				status: 200,
				body: {
					id: graph.id,
					likes: graph.likesTotal,
					downloads: graph.downloadsTotal,
					versions: graph._count.versions,
					description: graph.description,
					user: {
						id: graph.user.id,
						name: graph.user.name || 'Unknown',
						image: graph.user.image
					},
					name: graph.name,
					thumbnail: graph.thumbnail?.path || null,
					createdAt: graph.createdAt.getTime()
				}
			};
		},
		listGraphs: async ({ query }) => {
			const cursorAdd = withCursor(query.token);

			const graphs = await prisma.publishedGraph.findMany({
				take: query.take,
				skip: query.skip,
				orderBy: {
					updatedAt: 'desc'
				},
				select: {
					_count: {
						select: {
							versions: true
						}
					},
					user: true,
					name: true,
					id: true,
					thumbnail: true,
					owner: true,
					createdAt: true,
					likesTotal: true,
					downloadsTotal: true
				},
				...cursorAdd
			});

			const token =
				graphs.length > 0 ? graphs[graphs.length - 1].id : undefined;

			return {
				status: 200,
				body: {
					token,
					graphs: graphs.map(g => {
						return {
							id: g.id,
							likes: g.likesTotal,
							downloads: g.downloadsTotal,
							versions: g._count.versions,
							user: {
								id: g.user.id,
								name: g.user.name || 'Unknown',
								image: g.user.image
							},
							name: g.name,
							thumbnail: g.thumbnail?.path || null,
							createdAt: g.createdAt.getTime()
						};
					})
				}
			};
		},

		copyGraph: {
			middleware: [authMiddleware],
			handler: async ({ params }, { request }) => {
				const { id } = params;
				const graph = await prisma.publishedGraph.findFirst({
					where: {
						id
					},
					include: {
						versions: true
					}
				});

				if (!graph) {
					return {
						status: 404,
						body: {
							message: 'Graph not found'
						}
					};
				}

				//Check for versions
				const latestVersion = graph.versions[0];

				if (!latestVersion) {
					return {
						status: 404,
						body: {
							message: 'Graph not found'
						}
					};
				}

				//Update the totalDownload count

				await prisma.publishedGraph.update({
					where: {
						id
					},
					data: {
						downloadsTotal: {
							increment: 1
						}
					}
				});

				//Now that we have the graph, we need to duplicate it for the user
				const owner = request.user;

				const newGraph = await prisma.graph.create({
					data: {
						name: graph.name,
						graph: latestVersion.graph,
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
		likeGraph: async ({ params }) => {
			const { id } = params;
			const graph = await prisma.publishedGraph.findFirst({
				where: {
					id
				}
			});

			if (!graph) {
				return {
					status: 404,
					body: {
						message: 'Graph not found'
					}
				};
			}

			await prisma.publishedGraph.update({
				where: {
					id
				},
				data: {
					likesTotal: {
						increment: 1
					}
				}
			});

			return {
				status: 200,
				body: {}
			};
		}
	}
);
