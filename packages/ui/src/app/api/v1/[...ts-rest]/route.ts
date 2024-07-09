import { Context } from '@/api/utils/types.ts';
import { TsRestRequest } from '@ts-rest/serverless';
import { auth } from '@/auth/index.ts';
import { contract } from '@/api/contracts/index.ts';
import { createNextHandler } from '@ts-rest/serverless/next';
import { root } from '@/api/controllers/index.ts';

type ExtendedRequest = TsRestRequest & Context;

const handler = createNextHandler(contract, root, {
	requestMiddleware: [
		async (req: ExtendedRequest) => {
			const session = await auth();

			if (!session) {
				return Response.json(
					{},
					{
						status: 401
					}
				);
			}
			req.session = session;
			req.user = session.user!.id!;
		}
	],
	basePath: '/api/v1',
	jsonQuery: true,
	responseValidation: true,
	handlerType: 'app-router'
});

export {
	handler as GET,
	handler as POST,
	handler as PUT,
	handler as PATCH,
	handler as DELETE
};
