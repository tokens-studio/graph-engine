import { inject } from 'inversify';
import {
    Body,
    Controller,
    Get,
    Delete,
    Post,
    Query,
    Route,
    SuccessResponse,
    Request,
    Security,
    Tags,
} from "@tsoa/runtime";
import { PrismaClient } from '@prisma/client';
import { provideSingleton } from '@/utils/singleton';
import winston from 'winston';
import { AuthenticatedRequest } from '@/interfaces/authenticatedRequest';


interface GraphCreationParams {
    /**
     * A human readable name for the graph
     */
    name: string;
    /**
     * The json serialized graph
     */
    graph: string;
}

interface CreatedGraph {
    id: string;
}




@Route("graph")
@Tags("Graph")
@provideSingleton(UsersController)
export class UsersController extends Controller {

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
    @Security("cookieAuth")
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
    @Security("cookieAuth")
    @Get('{graphId}')
    public async getGraph(
        @Request() request: AuthenticatedRequest,
        graphId: string
    ) {
            console.log(graphId)
        // return graphs;
    }

    @SuccessResponse("200")
    @Security("cookieAuth")
    @Delete('{graphId}')
    public async deleteGraph(
        @Request() request: AuthenticatedRequest,
        @Query() graphId: string
    ) {
        // return graphs;
    }


}