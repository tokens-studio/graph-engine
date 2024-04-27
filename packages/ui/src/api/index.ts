import { OpenAPI } from '@tokens-studio/graph-engine-sdk';

OpenAPI.BASE = process.env.API_PATH!;
OpenAPI.WITH_CREDENTIALS = true;

export * from '@tokens-studio/graph-engine-sdk';