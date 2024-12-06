import { TsRestResponse, createNextHandler } from '@ts-rest/serverless/next';
import { contract } from '@/api/contracts/index.ts';
import { root } from '@/api/controllers/index.ts';

const handler = createNextHandler(contract, root, {
	basePath: '/api/v1',
	jsonQuery: true,
	responseValidation: true,
	handlerType: 'app-router',
	errorHandler: error => {
		console.error(error);
		return TsRestResponse.fromJson(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
});

export {
	handler as GET,
	handler as POST,
	handler as PUT,
	handler as PATCH,
	handler as DELETE
};
