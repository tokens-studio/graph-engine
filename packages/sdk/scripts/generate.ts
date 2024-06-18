import { createClient } from '@hey-api/openapi-ts';

createClient({
    format: 'prettier',
    client: 'axios',
    lint: 'eslint',
    input: './swagger.json',
    output: 'src/generated',
});