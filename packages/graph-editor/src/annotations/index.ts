
//Used on ports to indicate meta from a ui
export const deletable = 'ui.deletable';
export const resetable = 'ui.resetable';
//Used on nodes to indicate meta from a ui
export const xpos = 'ui.position.x'
export const ypos = 'ui.position.y'
/**
 * Indicates that a node should not update the underlying control immediately. This is useful for nodes that need to wait for a user to finish typing before updating the control for example
 * TODO: Implement
 */
export const pauseInput = 'ui.pauseInput';

//Used on nodes and graph
export const title = 'ui.title';
export const description = 'ui.description';

//Used exclusively on graph
export const uiViewport = 'ui.viewport';
export const savedViewports = 'ui.viewports';
export const uiVersion = 'ui.version';
export const uiNodeType = 'ui.nodeType';
