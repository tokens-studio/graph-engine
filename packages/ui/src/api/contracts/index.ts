import { contract as authContract } from './auth.ts';
import { graphContract } from './graph.ts';
import { marketplaceContract } from './marketplace.ts';

export const contract = {
	graph: graphContract,
	auth: authContract,
	marketplace: marketplaceContract
};
