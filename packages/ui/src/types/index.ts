import { TokenType } from '#/utils/index.ts';

export type Token = {
  name: string;
  value: any;
  type: TokenType;
};
