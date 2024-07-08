
import { contract } from '../contracts/index.ts';
import { initQueryClient } from '@ts-rest/react-query';

export const client = initQueryClient(contract, {
    baseUrl: 'http://localhost:3000/api/v1',
    baseHeaders: {},
});