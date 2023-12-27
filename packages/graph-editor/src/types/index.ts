import { Node,Edge, Viewport } from 'reactflow';
import { TokenType } from '../utils/index.ts';
import { Graph } from '@tokens-studio/graph-engine';

export type Token = {
  name: string;
  value: any;
  type: TokenType;
};


export type FlowGraph = {
  /**
   * Inner graph of the flow graph
   */
  graph: Graph,

  /**
   * Flow graph specific properties
   */
  nodes:Node[],
  edges:Edge[],
  grid: {
    size:number;
    show:boolean;
    snap:boolean;
  };
  viewport:Viewport;
  /**
   * Version of the flow graph
   */
  version: string;
}