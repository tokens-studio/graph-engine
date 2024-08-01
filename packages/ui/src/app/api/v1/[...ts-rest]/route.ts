import { contract } from '@/api/contracts/index.ts';
import { createNextHandler } from '@ts-rest/serverless/next';
import { root } from '@/api/controllers/index.ts';

const handler = createNextHandler(contract, root, {
	basePath: '/api/v1',
	jsonQuery: true,
	responseValidation: true,
	handlerType: 'app-router',
	errorHandler: (error, req, res) => {
		console.error(error);
		res.status(500).json({
			error: 'Internal Server Error'
		});
	}
});

export {
	handler as GET,
	handler as POST,
	handler as PUT,
	handler as PATCH,
	handler as DELETE
};
