import { router as auth } from './auth.ts';
import { router as graph } from './graph.ts';

export const root = {
    auth,
    graph
}