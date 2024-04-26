import { inject } from 'inversify';
import {
    Body,
    Controller,
    Get,
    Delete,
    Post,
    Queries,
    Path,
    Query,
    Route,
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
import { Paginated } from './models/page';
import type { InputDefinition } from "@tokens-studio/graph-engine";


interface InvokeableInputDefinition extends InputDefinition {
}

interface InvokeParams {
    graphId: string;
    payload: Record<string, InvokeableInputDefinition>
}

export interface PaginatedParams extends Paginated {
}

@Route("executions")
@Tags("Execution")
@Security("bearerAuth")
@provideSingleton(ExecutionController)
export class ExecutionController extends Controller {

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



    @Post()
    public async invoke(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: InvokeParams
    ) {
    }

    @SuccessResponse("200")
    @Get()
    public async getResources(
        @Request() request: AuthenticatedRequest,
        @Queries() params: PaginatedParams
    ) {
    }


    @SuccessResponse("200")
    @Get('{id}')
    public async getResource(
        @Request() request: AuthenticatedRequest,
        @Path() id: string
    ) {
    }

    @Get('{id}/artifacts/{artifactId}')
    public async getArtifact(
        @Request() request: AuthenticatedRequest,
        @Path() id: string,
        @Path() artifactId: string
    ) {
    }

    @Get('{id}/logs/{artifactId}')
    public async getLog(
        @Request() request: AuthenticatedRequest,
        @Path() id: string,
        @Path() artifactId: string
    ) {
    }

}