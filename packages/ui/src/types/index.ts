import { TokenType } from '#/utils/index.ts';
import { Edge, Node } from 'reactflow';
export type Token = {
  name: string;
  value: any;
  type: TokenType;
};

/**
 * The raw graph
 */
export type GeneratorGraph = {
  nodes: Node[];
  edges: Edge[];
  state: {
    /**
     * Id based state
     */
    [key: string]: any;
  };
  /**
   * Code saved for the graph
   */
  code: string | undefined;
};
