import { router as auth } from './auth.ts';
import { router as graph } from './graph.ts';
import { router as marketplace } from './marketplace.ts';

export const root = {
	auth,
	graph,
	marketplace
};
