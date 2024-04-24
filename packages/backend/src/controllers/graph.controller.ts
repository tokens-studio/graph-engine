import { Graph, PrismaClient, } from '@prisma/client'
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Request,
    Security,
    Tags,
} from "tsoa";



@Route("graph")
@Tags("Graph")
export class UsersController extends Controller {

    private prisma: PrismaClient;
    constructor() {
        super();
        this.prisma = new PrismaClient();
    }



    @SuccessResponse("201")
    @Post()
    public async createGraph(
        @Body() requestBody: Graph
    ): Promise<void> {
        this.setStatus(201);
        await this.prisma.graph.create(
            {
                data: {
                    ...requestBody
                }
            }
        )
        return;
    }


}