
import { ReactFlowInstance } from 'reactflow';


export const clear = (reactFlowInstance: ReactFlowInstance, graph) => {
    graph.clear();
    reactFlowInstance.setNodes([]);
    reactFlowInstance.setEdges([]);
};