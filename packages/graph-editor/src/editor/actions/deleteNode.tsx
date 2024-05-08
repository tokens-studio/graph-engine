import { Dispatch } from "@/redux/store";
import { Graph } from "@tokens-studio/graph-engine";
import { ReactFlowInstance } from "reactflow";

export const deleteNode = (graph: Graph, dispatch: Dispatch, reactFlowInstance: ReactFlowInstance) => {

    return (id: string) => {


        const inEdges = graph.inEdges(id);
        const outEdges = graph.outEdges(id);

        const node = graph.removeNode(id);


        //Delete from the node as well

        dispatch.graph.checkClearSelectedNode(id);

        //Delete from the react flow instance
        reactFlowInstance.deleteElements({
            nodes: [{ id }],
            edges: inEdges.concat(outEdges).map((edge) => ({ id: edge.id }))
        });


        //We also need to delete any edges that are connected to this node


        if (node) {
            dispatch.graph.appendLog({
                time: new Date(),
                type: 'info',
                data: {
                    id: id,
                    msg: `Node deleted`
                },
            })
        }
    }
}