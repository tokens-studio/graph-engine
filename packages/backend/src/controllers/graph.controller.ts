import { inject } from 'inversify';
import {
    Body,
    Controller,
    Get,
    Delete,
    Post,
    Queries,
    Put,
    Route,
    Path,
    SuccessResponse,
    Response,
    Request,
    Security,
    Tags,
} from "@tsoa/runtime";
import { PrismaClient, Prisma } from '@prisma/client';
import { provideSingleton } from '@/utils/singleton';
import winston from 'winston';
import type { AuthenticatedRequest } from '@/interfaces/authenticatedRequest';
import { SerializedGraph } from '@tokens-studio/graph-engine';

type SerializedGraphVal = SerializedGraph

type Graph = {
    id: string;
    name: string;
    graph: SerializedGraphVal;
    owner: string;
    createdAt: Date;
    updatedAt: Date;
}

type ListedGraph = Omit<Graph, 'graph'> 

type GraphCreationParams = {
    /**
     * A human readable name for the graph
     */
    name: string;
    /**
     * The json serialized graph
     */
    graph: SerializedGraphVal;
    /**
     * A human readable description of the graph
     */
    description?:string
}


/**
 * The created graph
 */
export interface CreatedGraph extends Pick<Graph, 'id'> { }


export interface ListGraphParams {
    /**
     * @minimum 1
     * @maximum 20
     * @default 10
     * @isInt 
     * The number of items to return
     */
    perPage: number;
    /**
     * @minimum 0
     * @default 0
     * @isInt
     * The page number to return
     */
    page: number;

}

@Route("graph")
@Tags("Graph")
@Security("bearerAuth")
@provideSingleton(GraphController)
export class GraphController extends Controller {

    dataSource: PrismaClient;
    logger: winston.Logger;
    constructor(
        @inject(winston.Logger) logger: winston.Logger,
        @inject(PrismaClient) dataSource: PrismaClient
    ) {
        super();
        this.dataSource = dataSource;
        this.logger = logger;
    }

    /**
     * Creates a new graph for the user
     * @param requestBody 
     */
    @SuccessResponse("201")

    @Post()
    public async createGraph(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: GraphCreationParams
    ): Promise<CreatedGraph> {
        //TODO add validation here
        const newGraph = await this.dataSource.graph.create({
            data: {
                name: requestBody.name,
                graph: JSON.stringify(requestBody.graph),
                owner: request.user.id
            }
        });

        this.setStatus(201);

        return {
            id: newGraph.id
        }
    }


    @Put('{graphId}')
    @Response<any>("404", "Graph not found")
    @SuccessResponse("200")
    public async updateGraph(
        @Request() request: AuthenticatedRequest,
        @Path() graphId: string,
        @Body() requestBody: GraphCreationParams
    ) {
        const graph = await this.dataSource.graph.findFirst({
            where: {
                id: graphId,
                owner: request.user.id
            },
            select: {
                id: true,
                name: true,
                owner:true,
                updatedAt:true,
                createdAt:true,
            }
        });

        if (!graph) {
            this.setStatus(404);
            return;
        }

        await this.dataSource.graph.update({
            where: {
                id: graphId
            },
            data: {
                name: requestBody.name,
                graph: JSON.stringify(requestBody.graph)
            }
        });
    } 

    @SuccessResponse("200")
    @Get()
    public async listGraphs(
        @Request() request: AuthenticatedRequest,
        @Queries() queryParams: ListGraphParams

    ): Promise<ListedGraph[]> {
        const graphs = await this.dataSource.graph.findMany({
            take: queryParams.perPage,
            skip: queryParams.page * queryParams.perPage,
            where: {
                owner: request.user.id
            },
            select: {
                id: true,
                name: true,
                owner:true,
                updatedAt:true,
                createdAt:true,
            }
        });
        this.setStatus(200);
        return graphs as ListedGraph[];
    }


    @SuccessResponse("200")
    @Response<any>("404", "Graph not found")
    @Get('{graphId}')
    public async getGraph(
        @Request() request: AuthenticatedRequest,
        @Path() graphId: string
    ): Promise<Graph> {
        const graph = await this.dataSource.graph.findFirst({
            where: {
                id: graphId,
                owner: request.user.id
            }
        })
        if (!graph) {
            this.setStatus(404);
            return;
        }

        this.setStatus(200);
        return {
            ...graph,
            graph: JSON.parse(graph.graph.toString())
        };
    }

    @SuccessResponse("200")
    @Response<any>("404", "Graph not found")
    @Delete('{graphId}')
    public async deleteGraph(
        @Request() request: AuthenticatedRequest,
        @Path() graphId: string
    ) {

        try {
            await this.dataSource.graph.delete({
                where: {
                    id: graphId,
                    owner: request.user.id
                }
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2025') {
                    this.setStatus(404);
                    return;
                }
            }
            throw err;
        }
    }
}