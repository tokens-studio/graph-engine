import { contract as authContract } from './auth.ts';
import { graphContract } from './graph.ts';

export const contract = {
    graph: graphContract,
    auth: authContract
}
