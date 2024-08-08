import {
  ApplyCapabilities,
  Graph,
  WithControlFlow,
  WithDataFlow,
} from '@tokens-studio/graph-engine';
import { TokenType } from '../utils/index.js';

export type Token = {
  name: string;
  value: unknown;
  type: TokenType;
};

export type FullyFeaturedGraph = ApplyCapabilities<
  Graph,
  [WithControlFlow, WithDataFlow]
>;

export * from './controls.js';
