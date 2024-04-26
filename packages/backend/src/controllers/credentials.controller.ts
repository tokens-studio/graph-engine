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



interface CredentialCreationParams {
}

export interface PaginatedListCredsParams extends Paginated {
}

@Route("credentials")
@Tags("Credentials")
@Security("bearerAuth")
@provideSingleton(CredentialController)
export class CredentialController extends Controller {

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
    public async createCreds(
        @Request() request: AuthenticatedRequest,
        @Body() requestBody: CredentialCreationParams
    ) {
    }

    @SuccessResponse("200")
    @Get()
    public async listCreds(
        @Request() request: AuthenticatedRequest,
        @Queries() params: PaginatedListCredsParams
    ) {
    }


    @SuccessResponse("200")
    @Get('{id}')
    public async getCreds(
        @Request() request: AuthenticatedRequest,
        @Path() id: string
    ) {
    }

    @SuccessResponse("200")
    @Response<any>("404", "Credential not found")
    @Delete('{id}')
    public async deleteCred(
        @Request() request: AuthenticatedRequest,
        @Path() id: string
    ) {
    }
}