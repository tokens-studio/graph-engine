import { Session } from 'next-auth';
import { TsRestRequest } from '@ts-rest/serverless';

export type Context = {
	session: Session;
	user: string;
};

export type ExtendedRequest = TsRestRequest & Context;
