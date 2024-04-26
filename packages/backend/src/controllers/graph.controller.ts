import { inject } from 'inversify';
import {
    Body,
    Controller,
    Get,
    Delete,
    Post,
    Queries,
    Query,
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


type GraphCreationParams = {
    /**
     * A human readable name for the graph
     */
    name: string;
    /**
     * The json serialized graph
     */
    graph: string;
}

type Graph = {
    id: string;
    name: string;
    graph: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * The created graph
 */
export interface CreatedGraph extends Pick<Graph, 'id'> { }


export interface ListGraphParams{
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
                graph: requestBody.graph,
                owner: request.user.id
            }
        });

        this.setStatus(201);

        return {
            id: newGraph.id
        }
    }


    @SuccessResponse("200")
    @Get()
    public async listGraphs(
        @Request() request: AuthenticatedRequest,
        @Queries() queryParams: ListGraphParams

    ): Promise<Graph[]> {
        const graphs = await this.dataSource.graph.findMany({
            take: queryParams.perPage,
            skip: queryParams.page * queryParams.perPage,
            where: {
                owner: request.user.id
            }
        });
        this.setStatus(200);
        return graphs;
    }


    @SuccessResponse("200")
    @Response<any>("404", "Graph not found")
    @Get('{graphId}')
    public async getGraph(
        @Request() request: AuthenticatedRequest,
        @Path() graphId: string
    ):Promise<Graph> {
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
        return graph;
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