import { Context } from '../utils/types.ts';
import { router as ai } from './ai.ts';
import { router as auth } from './auth.ts';
import { contract } from '../contracts/index.ts';
import { router as graph } from './graph.ts';
import { router as marketplace } from './marketplace.ts';
import { tsr } from '@ts-rest/serverless/next';

export const root = tsr.router<typeof contract, Context>(contract, {
	ai,
	auth,
	graph,
	marketplace
});
