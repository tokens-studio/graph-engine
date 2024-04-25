import { createClient } from '@hey-api/openapi-ts';
import path from 'path';


createClient({
    format: 'prettier',
    client: 'axios',
    lint: 'eslint',
    input: '../backend/src/generated/swagger.json',
    output: 'src',
});