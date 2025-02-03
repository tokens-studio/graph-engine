/**
 * Identifies the version of the engine that the graph was created with
 */
export const annotatedVersion = 'engine.version';
/**
 * Identifies the index of the variadic input
 */
export const annotatedVariadicIndex = 'engine.index';
/**
 * Identifies the current play state of the engine
 */
export const annotatedPlayState = 'engine.playState';
/**
 * Identifies the presence of a theme context node in the graph
 */
export const annotatedContainsThemeContextNode = 'containsThemeContextNode';

/**
 * Identifies all dynamic sets referenced by this graph
 */
export const annotatedReferencedDynamicSets = 'referencedDynamicSets';

export const annotatedCapabilityPrefix = 'engine.capability.';

/**
 * Hides a property from being exposed to the parent in the subgraph
 */
export const hideFromParentSubgraph = 'engine.hideFromParentSubgraph';

/**
 * Indicates that node will use dynamically created inputs
 */
export const annotatedDynamicInputs = 'engine.dynamicInputs';

/**
 * Indicates that there should only ever be one instance of this node in the graph
 */
export const annotatedSingleton = 'engine.singleton';

/**
 * Indicates whether the node is deletable. Default is true
 */
export const annotatedDeleteable = 'engine.deletable';

/**
 * Indicates that a node is currently running
 */
export const annotatedNodeRunning = 'engine.nodeRunning';

/**
 * Unique id of the entity
 */
export const annotatedId = 'engine.id';
