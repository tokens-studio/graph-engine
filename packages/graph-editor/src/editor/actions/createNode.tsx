import { Dispatch } from '@/redux/store.js';
import { Graph, Node, NodeFactory } from '@tokens-studio/graph-engine';
import { ReactFlowInstance, Node as ReactFlowNode } from 'reactflow';

export type NodeRequest = {
  type: string;
  position?: { x: number; y: number };
  data?: unknown;
};

export interface ICreateNode {
  reactFlowInstance: ReactFlowInstance;
  graph: Graph;
  nodeLookup: Record<string, NodeFactory>;
  iconLookup: Record<string, string>;
  /**
   * If a customized node would be created in the editor, it would be created using this UI lookup.
   * This takes a node type such as 'studio.tokens.math.add' as a key and a string of the custom node type as a value.
   */
  customUI: Record<string, string>;
  dropPanelPosition: { x: number; y: number };
  dispatch: Dispatch;
}

export const createNode = ({
  reactFlowInstance,
  graph,
  nodeLookup,
  iconLookup,
  customUI,
  dropPanelPosition,
  dispatch,
}: ICreateNode) => {
  return (nodeRequest: NodeRequest) => {
    const position = nodeRequest.position || {
      x: dropPanelPosition.x,
      y: dropPanelPosition.y,
    };

    const nodes: Node[] = Object.values(graph.nodes);

    // Couldn't determine the type
    if (!nodeRequest.type) {
      return;
    }
    if (
      nodeRequest.type == 'INPUT' &&
      nodes.some((x) => x.nodeType() == 'INPUT')
    ) {
      alert('Only one input node allowed');
      return;
    }
    if (
      nodeRequest.type == 'OUTPUT' &&
      nodes.some((x) => x.nodeType() == 'OUTPUT')
    ) {
      alert('Only one output node allowed');
      return;
    }

    //Lookup the node type
    const Factory = nodeLookup[nodeRequest.type];

    //Generate the new node
    const node = new Factory({
      graph: graph,
    });
    graph.addNode(node);

    const finalPos = position || { x: 0, y: 0 };

    if (customUI[nodeRequest.type]) {
      node.annotations['uiNodeType'] = customUI[nodeRequest.type];
    }

    //Set values from the request
    Object.entries(nodeRequest.data || {}).forEach(([name, value]) => {
      //Its possible that the node doesn't have this input
      const input = node.inputs[name];
      if (!input) {
        return;
      }
      node.inputs[name].setValue(value);
    });

    //Update immediately
    graph.update(node.id);

    //Add the node to the react flow instance
    const reactFlowNode = {
      id: node.id,
      dragHandle: '.reactflow-draggable-handle',
      type: customUI[nodeRequest.type] || 'GenericNode',
      data: {
        icon: iconLookup[nodeRequest.type],
      },
      position: finalPos,
    } as ReactFlowNode;

    dispatch.graph.appendLog({
      time: new Date(),
      type: 'info',
      data: {
        type: nodeRequest.type,
        id: node.id,
        msg: `Node created`,
      },
    });

    reactFlowInstance.addNodes(reactFlowNode);

    return {
      graphNode: node,
      flowNode: reactFlowNode,
    };
  };
};
