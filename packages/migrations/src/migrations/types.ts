import { FlowGraph } from "@tokens-studio/graph-engine";

export type UpgradeFunction = (graph: FlowGraph) => Promise<FlowGraph>;
