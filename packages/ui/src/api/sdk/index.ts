import { contract } from '../contracts/index.ts';
import { initQueryClient } from '@ts-rest/react-query';

export const client = initQueryClient(contract, {
	baseUrl: '/api/v1',
	baseHeaders: {}
});
