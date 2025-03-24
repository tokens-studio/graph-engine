import { aiContract } from '../contracts/ai.ts';
import { authMiddleware } from '../middleware.ts/auth.ts';
import { summarizeGraph } from '@/lib/anthropic/index.ts';
import { tsr } from '@ts-rest/serverless/next';
import rateLimitMiddleware from '../middleware.ts/rateLimiter.ts';
import type { Context } from '../utils/types.ts';
import type { SerializedGraph } from '@tokens-studio/graph-engine';

//@ts-ignore
export const router = tsr.router<typeof aiContract, Context>(aiContract, {
	getAISummary: {
		middleware: [authMiddleware, rateLimitMiddleware],
		handler: async ({ body }, { request }) => {
			const { graph } = body;
			const userId = request.session.user?.id;
			const summary = await summarizeGraph(graph as SerializedGraph, userId);
			return {
				status: 200,
				body: {
					summary
				}
			};
		}
	}
});
