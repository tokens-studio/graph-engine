import { Graph } from "@tokens-studio/graph-engine";

export type UpgradeFunction = (graph: Graph) => Promise<Graph>;
