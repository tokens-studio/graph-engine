import { Connection, Edge } from 'reactflow';
import { Dispatch } from '@/redux/store.js';
import { FullyFeaturedGraph } from '@/types/index.js';
import { deletable } from '@/annotations/index.js';
import { getVariadicIndex, stripVariadic } from '@/utils/stripVariadic.js';

export const connectNodes =
  ({
    graph,
    setEdges,
    dispatch,
  }: {
    graph: FullyFeaturedGraph;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    dispatch: Dispatch;
  }) =>
    (params: Connection) => {
      //Create the connection in the underlying graph

      let parameters = params;
      const sourceNode = graph.getNode(params.source!);
      const targetNode = graph.getNode(params.target!);

      const variadicIndex = getVariadicIndex(params.targetHandle!);

      if (!sourceNode || !targetNode) {
        throw new Error('Could not find node');
      }

      const strippedTargetHandle = stripVariadic(params.targetHandle!);
      let sourcePort = sourceNode.outputs[stripVariadic(params.sourceHandle!)];
      const targetPort = targetNode.inputs[strippedTargetHandle];

      if (params.sourceHandle === '[dynamic]') {
        let candidateName = strippedTargetHandle;
        let counter = 0;

        while (sourceNode.inputs[candidateName]) {
          candidateName = strippedTargetHandle + counter++;
        }

        //The user is trying to create a dynamic input
        sourceNode.addInput(candidateName, {
          type: targetPort.type,
          visible: false,
          annotations: {
            [deletable]: true,
          },
        });
        sourceNode.inputs[candidateName].setValue(targetPort.value);
        //Change the handle to the newly created handle
        sourcePort = sourceNode.outputs[candidateName];
        params.sourceHandle = candidateName;
      }

      //If the source port is variadic, check to see if there is already a connection
      else if (targetPort.variadic) {
        const alreadyConnected = targetPort._edges.some((edge) => {
          const index = edge.annotations['engine.index'] as number;
          return index === variadicIndex;
        });
        //Don't attempt to overwrite an existing index
        if (alreadyConnected) {
          return;
        }
      }
      //Check to see if there is already a connection
      else if (targetPort.isConnected) {
        //We need to disconnect the existing connection
        graph.removeEdge(targetPort._edges[0].id);
      }

      const newGraphEdge = graph.connect(
        sourceNode,
        sourcePort,
        targetNode,
        targetPort,
      );

      //If the target port is variadic, we need to add the index to the edge data
      if (targetPort.variadic) {
        const index = newGraphEdge.annotations['engine.index'] as number;

        parameters = {
          ...parameters,
          targetHandle: params.targetHandle + `[${index}]`,
        };
      }

      const newEdge = {
        ...parameters,
        id: newGraphEdge.id,
        type: 'custom',
      };

      dispatch.graph.appendLog({
        time: new Date(),
        type: 'info',
        data: {
          msg: `Edge #${newGraphEdge.id} created`,
        },
      });

      return setEdges((eds) => {
        const newEdgs = eds.reduce(
          (acc, edge) => {
            //All our inputs take a single input only, disconnect if we have a connection already
            if (
              edge.targetHandle == params.targetHandle &&
              edge.target === params.target
            ) {
              return acc;
            }
            acc.push(edge);
            return acc;
          },
          [newEdge] as Edge[],
        );
        return newEdgs;
      });
    };
