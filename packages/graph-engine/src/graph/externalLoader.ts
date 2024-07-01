import { Graph } from './graph.js';
import { Node } from '../programmatic/node.js';

export type ExternalLoadOptions = {
	/**
	 * The requesting node
	 */
	node: Node;
	/**
	 * The graph the node belongs to
	 */
	graph: Graph;
	/**
	 * The requested uri
	 */
	uri: string;
	/**
	 * Additional data for the request. This is likely different based on the different node
	 */
	data: any;
};
export type ExternalLoader = (opts: ExternalLoadOptions) => Promise<any> | any;
