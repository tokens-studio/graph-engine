declare module '@tokens-studio/graph-engine-migration' {
  import { SerializedGraph } from '@tokens-studio/graph-engine';
  export function updateGraph(
    graph: SerializedGraph,
    opts?: { verbose?: boolean },
  ): Promise<SerializedGraph>;
}
