import type { Identity } from '@ory/kratos-client';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
	user: Identity;
};
