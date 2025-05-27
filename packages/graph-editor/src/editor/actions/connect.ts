import { Connection, Edge } from 'reactflow';
import { Dispatch } from '@/redux/store.js';
import { Graph, canConvertSchemaTypesExtended } from '@tokens-studio/graph-engine';
import { TYPE_CONVERTER } from '@/ids.js';
import { deletable } from '@/annotations/index.js';
import { getVariadicIndex, stripVariadic } from '@/utils/stripVariadic.js';

export const connectNodes =
  ({
    graph,
    setEdges,
    dispatch,
    nodeLookup,
    reactFlowInstance,
  }: {
    graph: Graph;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    dispatch: Dispatch;
    nodeLookup: Record<string, any>;
    reactFlowInstance: any;
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

    // Check if types are compatible and need conversion
    const sourceType = sourcePort.type;
    const targetType = targetPort.type;
    const needsConversion = sourceType.$id !== targetType.$id &&
                           canConvertSchemaTypesExtended(sourceType, targetType) &&
                           sourceType.$id !== 'https://schemas.tokens.studio/any.json' &&
                           targetType.$id !== 'https://schemas.tokens.studio/any.json';

    if (needsConversion) {
      // Create a type converter node
      const TypeConverterClass = nodeLookup[TYPE_CONVERTER];
      if (TypeConverterClass) {
        const converterNode = new TypeConverterClass({ graph });

        // Set the conversion types
        converterNode.setConversionTypes(sourceType, targetType);

        // Calculate position between source and target
        const sourcePosition = reactFlowInstance?.getNode(params.source!)?.position || { x: 0, y: 0 };
        const targetPosition = reactFlowInstance?.getNode(params.target!)?.position || { x: 100, y: 0 };
        const converterPosition = {
          x: (sourcePosition.x + targetPosition.x) / 2,
          y: (sourcePosition.y + targetPosition.y) / 2
        };

        // Add the converter node to the graph
        graph.addNode(converterNode);

        // Add the converter node to React Flow
        const converterFlowNode = {
          id: converterNode.id,
          type: TYPE_CONVERTER,
          position: converterPosition,
          data: {},
        };

        reactFlowInstance?.addNodes(converterFlowNode);

        // Connect source to converter
        const sourceToConverterEdge = graph.connect(
          sourceNode,
          sourcePort,
          converterNode,
          converterNode.inputs.value
        );

        // Connect converter to target
        const converterToTargetEdge = graph.connect(
          converterNode,
          converterNode.outputs.value,
          targetNode,
          targetPort
        );

        // Create React Flow edges
        const sourceToConverterFlowEdge = {
          id: sourceToConverterEdge.id,
          source: params.source!,
          sourceHandle: params.sourceHandle!,
          target: converterNode.id,
          targetHandle: 'value',
          type: 'custom',
        };

        const converterToTargetFlowEdge = {
          id: converterToTargetEdge.id,
          source: converterNode.id,
          sourceHandle: 'value',
          target: params.target!,
          targetHandle: params.targetHandle!,
          type: 'custom',
        };

        dispatch.graph.appendLog({
          time: new Date(),
          type: 'info',
          data: {
            msg: `Type converter inserted between ${sourceType.$id} and ${targetType.$id}`,
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
            [sourceToConverterFlowEdge, converterToTargetFlowEdge] as Edge[],
          );
          return newEdgs;
        });
      }
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
