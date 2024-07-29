import { TokenType } from '../utils/index.js';

export type Token = {
  name: string;
  value: unknown;
  type: TokenType;
};

export * from './controls.js';
