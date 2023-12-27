import { NodeTypes, Node } from '@tokens-studio/graph-engine';
import { ReactFlowInstance } from 'reactflow';

export interface NodeRequest {
  type: NodeTypes;
  position?: { x: number; y: number };
  data?: any;
}

export const createNode = (
  reactFlowInstance: ReactFlowInstance,
  graph,
  nodeLookup,
  dropPanelPosition,
) => {
  return (nodeRequest: NodeRequest) => {
    const dropPosition = nodeRequest.position || {
      x: dropPanelPosition.x,
      y: dropPanelPosition.y,
    };

    const nodes: Node[] = Object.values(graph.nodes);

    // Couldn't determine the type
    if (!nodeRequest.type) {
      return;
    }
    if (
      nodeRequest.type == NodeTypes.INPUT &&
      nodes.some((x) => x.nodeType() == NodeTypes.INPUT)
    ) {
      alert('Only one input node allowed');
      return null;
    }
    if (
      nodeRequest.type == NodeTypes.OUTPUT &&
      nodes.some((x) => x.nodeType() == NodeTypes.OUTPUT)
    ) {
      alert('Only one output node allowed');
      return null;
    }
    // set x y coordinates in instance
    const position = reactFlowInstance.screenToFlowPosition(dropPosition);

    //Lookup the node type
    const Factory: typeof Node = nodeLookup[nodeRequest.type];

    //Generate the new node
    const node = new Factory();

    //Set values from the request
    Object.entries(nodeRequest.data || {}).forEach(([name, value]) => {
      //Its possible that the node doesn't have this input
      const input = node.inputs[name];
      if (!input) {
        return;
      }
      node.inputs[name].setValue(value);
    });

    //Add it to the existing graph
    graph.addNode(node);
    //Update immediately
    graph.update(node.id);

    //Add the node to the react flow instance
    const reactFlowNode = {
      id: node.id,
      type: 'GenericNode',
      data: {},
      position: position || { x: 0, y: 0 },
    };

    reactFlowInstance.addNodes(reactFlowNode);
  };
};
