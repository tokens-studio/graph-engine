import { contract } from './contracts/index.ts';
import { generateOpenApi } from '@ts-rest/open-api';

export const openApiDocument = generateOpenApi(contract, {
    info: {
        title: 'Graph API',
        version: '1.0.0',
        description:'The backend API for the graph service'
    },
    servers: [
        {
            url: '/api/v1',
        }
    ],
});