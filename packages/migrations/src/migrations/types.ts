import type { SerializedGraph } from '@tokens-studio/graph-engine';

export type UpgradeFunction = (
	graph: SerializedGraph
) => Promise<SerializedGraph>;
