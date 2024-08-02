import { aiContract } from './ai.ts';
import { contract as authContract } from './auth.ts';
import { graphContract } from './graph.ts';
import { marketplaceContract } from './marketplace.ts';

export const contract = {
	ai: aiContract,
	graph: graphContract,
	auth: authContract,
	marketplace: marketplaceContract
};
