import { Identity } from '@ory/kratos-client';
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
    user: Identity
}