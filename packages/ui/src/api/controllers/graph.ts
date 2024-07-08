
import { Context } from '../utils/types.ts';
import { Prisma } from '@prisma/client';
import { graphContract } from '../contracts/graph.ts';
import { prisma } from '@/lib/prisma/index.ts'
import { tsr } from '@ts-rest/serverless/next';

export const router = tsr.router<
    typeof graphContract,  
    Context 
>(graphContract, {
    listGraphs: async ({ query }, { request }) => {

        const owner = request.user;
        const graphs = await prisma.graph.findMany({
            take: query.take,
            skip: query.skip,
            where: {
                owner: owner
            },
            select: {
                name: true,
                id: true,
                graph: true,
                updatedAt: true
            }
        });

        return {
            status: 200,
            body: {
                graphs: graphs.map(g => {

                    return {
                        id: g.id,
                        name: g.name,
                        graph: JSON.parse(g.graph),
                        updatedAt: g.updatedAt.getTime(),
                    };
                })
            }
        };
    },
    createGraph: async ({ body }, { request }) => {
        const { name, graph } = body;

        const owner = request.user;
        const newGraph = await prisma.graph.create({
            data: {
                name: name,
                graph: JSON.stringify(graph),
                owner
            }
        });

        return {
            status: 201,
            body: {
                id: newGraph.id
            }
        };
    },
    getGraph: async ({ params }, { request }) => {

        const { id } = params;
        const owner = request.user;

        const graph = await prisma.graph.findFirst({
            where: {
                id,
                owner
            }
        });

        if (!graph) {
            return {
                status: 400,
                body: {
                    message: 'Entity not found'
                }
            }
        }

        return {
            status: 200,
            body: {
                id: graph.id,
                name: graph.name,
                graph: JSON.parse(graph.graph),
                updatedAt: graph.updatedAt.getTime(),
            }
        };

    },
    deleteGraph: async ({ params }, { request }) => {

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
        }
    },
    updateGraph: async ({ body, params }, { request }) => {
        const { id } = params;
        const { name, graph } = body;

        const data = {};

        if (name) {
            data['name'] = name;
        }
        if (graph) {
            data['graph'] = JSON.stringify(graph);
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



    },
});
