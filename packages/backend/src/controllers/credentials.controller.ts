import {
	Controller,
	Delete,
	Get,
	Post,
	Response,
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

export interface PaginatedListCredsParams extends Paginated {}

@Route('credentials')
@Tags('Credentials')
@Security('bearerAuth')
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
	public async createCreds() {}

	@SuccessResponse('200')
	@Get()
	public async listCreds() {}

	@SuccessResponse('200')
	@Get('{id}')
	public async getCreds() {}

	@SuccessResponse('200')
	@Response<unknown>('404', 'Credential not found')
	@Delete('{id}')
	public async deleteCred() {}
}
