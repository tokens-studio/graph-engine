import {
	Controller,
	Get,
	Post,
	Route,
	Security,
	SuccessResponse,
	Tags
} from '@tsoa/runtime';
import { Paginated } from './models/page';
import { PrismaClient } from '@prisma/client';
import { inject } from 'inversify';
import { provideSingleton } from '@/utils/singleton';
import winston from 'winston';

export interface PaginatedParams extends Paginated {}

@Route('executions')
@Tags('Execution')
@Security('bearerAuth')
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
	public async invoke() {}

	@SuccessResponse('200')
	@Get()
	public async getResources() {}

	@SuccessResponse('200')
	@Get('{id}')
	public async getResource() {}

	@Get('{id}/artifacts/{artifactId}')
	public async getArtifact() {}

	@Get('{id}/logs/{artifactId}')
	public async getLog() {}
}
