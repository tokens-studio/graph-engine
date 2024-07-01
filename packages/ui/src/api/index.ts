import { OpenAPI } from '@tokens-studio/graph-engine-sdk';

/**
 * Need to do this via a function otherwise the values will be tree shaken as side effects are not expected.
 */
export const configure = () => {
  OpenAPI.BASE = process.env.API_PATH!;
  console.log('API_PATH', OpenAPI.BASE, process.env.API_PATH);
  OpenAPI.WITH_CREDENTIALS = true;
};

export * from '@tokens-studio/graph-engine-sdk';
