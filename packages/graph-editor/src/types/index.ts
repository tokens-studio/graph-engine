import { TokenType } from '../utils/index.js';

export type Token = {
  name: string;
  value: any;
  type: TokenType;
};


export * from './controls.js';