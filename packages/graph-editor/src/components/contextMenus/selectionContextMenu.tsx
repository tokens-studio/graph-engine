import {
    Menu,
    Item,
    Separator,
} from 'react-contexify';
import React, { useCallback } from 'react';
import {
    Node,
    NodeToolbar,
    getRectOfNodes,
    useNodes,
    useReactFlow,
    useStoreApi,
} from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useLocalGraph } from '@/hooks';
import { getId } from '../flow/utils';
import { NodeTypes } from '../flow/types';
import { Edge, Graph } from '@tokens-studio/graph-engine';
import { useAction } from '@/editor/actions/provider';

export type INodeContextMenuProps = {
    id: string,
    nodes: Node[]
}

const padding = 25;

export const SelectionContextMenu = ({
    id,
    nodes
}: INodeContextMenuProps) => {
    const reactFlowInstance = useReactFlow();
    const graph = useLocalGraph();
    const store = useStoreApi();
    const createNode = useAction('createNode');
    const duplicateNodes = useAction('duplicateNodes');

    //Note that we use a filter here to prevent getting nodes that have a parent node, ie are part of a group
    const selectedNodes = nodes.filter(
        (node) => node.selected && !node.parentNode,
    );
    const selectedNodeIds = selectedNodes.map((node) => node.id);

    const onGroup = useCallback(() => {
        const rectOfNodes = getRectOfNodes(nodes);
        const groupId = getId('group');
        const parentPosition = {
            x: rectOfNodes.x,
            y: rectOfNodes.y,
        };
        const groupNode = {
            id: groupId,
            type: NodeTypes.GROUP,
            position: parentPosition,
            style: {
                width: rectOfNodes.width + padding * 2,
                height: rectOfNodes.height + padding * 2,
            },
            data: {
                expandable: true,
                expanded: true,
            },
        } as Node;


        store.getState().resetSelectedElements();
        store.setState({ nodesSelectionActive: false });
        reactFlowInstance.setNodes((nodes) => {

            //Note that group nodes should always occur before their parents
            return [groupNode].concat(nodes.map(node => {
                if (selectedNodeIds.includes(node.id)) {
                    return {
                        ...node,
                        position: {
                            x: node.position.x - parentPosition.x + padding,
                            y: node.position.y - parentPosition.y + padding,
                        },
                        extent: 'parent' as 'parent',
                        parentNode: groupId,
                    };
                }

                return node;
            }))

        }
        );
    }, [nodes, reactFlowInstance, selectedNodeIds, store]);

    const onCreateSubgraph = useCallback(() => {

        //We need to work out which nodes do not have parents in the selection

        const lookup = new Set(selectedNodeIds);

        //Lets create a new subgraph node

        //Get the position by finding the average of the selected nodes
        const position = selectedNodes.reduce((acc, node) => {
            acc.x += node.position.x;
            acc.y += node.position.y;
            return acc;
        }, { x: 0, y: 0 });

        const finalPosition = {
            x: position.x / selectedNodes.length,
            y: position.y / selectedNodes.length
        }

        const nodes = createNode({
            type: 'studio.tokens.generic.subgraph',
            position: finalPosition
        });

        //Request failed in some way
        if (!nodes) {
            return;
        }

        const { graphNode, flowNode } = nodes;

        const internalGraph = graphNode._innerGraph as unknown as Graph;

        //Get the graph nodes from the existing graph
        const internalNodes = selectedNodeIds.map(id => graph.getNode(id)).filter(x => x);


        //Get the input node of the subgraph
        const existingInternal = Object.values(internalGraph.nodes);
        const inputNode = existingInternal.find(x => x.factory.type == 'studio.tokens.generic.input');
        const outputNode = existingInternal.find(x => x.factory.type == 'studio.tokens.generic.output');

        //Now we need to determine the inputs and outputs of the subgraph
        //We need to find the entry nodes and the exit nodes

        //The entry nodes are the nodes that have incoming edges that are not in the selection
        //The exit nodes are the nodes that have outgoing edges that are not in the selection

        const { exitEdges, internalEdges } = selectedNodeIds.reduce((acc, x) => {
            const edges = graph.outEdges(x);
            //If there is an edge that is not in the selection then it is an entry node
            edges.forEach(edge => {
                const isOutgoing = !lookup.has(edge.target);

                if (isOutgoing) {
                    acc.exitEdges.push(edge);
                } else {
                    acc.internalEdges.push(edge);
                }

            });
            return acc;
        }, {
            exitEdges: [] as Edge[],
            internalEdges: [] as Edge[]
        });

        const entryEdges = selectedNodeIds.reduce((acc, x) => {
            const edges = graph.inEdges(x);

            //If there is an edge that is not in the selection then it is an entry node
            const incomingEdges = edges.filter(edge => {
                return !lookup.has(edge.source);
            });

            if (incomingEdges.length != 0) {
                acc = acc.concat(incomingEdges);
            }
            return acc;
        }, [] as Edge[]);


        //Add the nodes to the subgraph
        internalNodes.forEach(node => {
            internalGraph.addNode(node!)
        });

        //We need to create a input  for each of the entry edges
        entryEdges.forEach(edge => {

            //Get the output node of the edge
            const outputNode = graph.getNode(edge.target);
            const input = outputNode?.inputs[edge.targetHandle]

            //Its possible that we have a collision with the name so we need to rename it
            let initialName = edge.targetHandle;
            let name = initialName;
            let count = 0;

            while (inputNode?.inputs[name]) {
                name = initialName + '_' + count++;
            }

            inputNode?.addInput(name, {
                type: input!.type
            });
            //The output won't be dynamically generated until the node is executed, so we add it manually
            inputNode?.addOutput(name, {
                type: input!.type
            });

            //Then we need to restore the old edge and connect it to the new input
            const newEdge = graph.createEdge({
                id: uuid(),
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: graphNode.id,
                targetHandle: name
            });


            //Create an edge in the internal graph from the input to the target
            internalGraph.createEdge({
                id: uuid(),
                source: inputNode!.id,
                sourceHandle: name,
                target: edge.target,
                targetHandle: edge.targetHandle
            });


            //We also need to add a flow edge
            reactFlowInstance.addEdges([newEdge]);
        });

        exitEdges.forEach(edge => {

            //Get the output node of the edge
            const sourceNode = graph.getNode(edge.source);
            const sourceOutput = sourceNode?.outputs[edge.sourceHandle];


            //Its possible that we have a collision with the name so we need to rename it
            let initialName = edge.targetHandle;
            let name = initialName;
            let count = 0;

            while (outputNode?.inputs[name]) {
                name = initialName + '_' + count++;
            }

            outputNode?.addInput(name, {
                type: sourceOutput!.type
            });
            outputNode?.addOutput(name, {
                type: sourceOutput!.type
            });

            //Ensure the output exists on the outer graph node as it will only be dynamically populated once the subgraph has run
            graphNode.addOutput(name, {
                type: sourceOutput!.type
            });


            //Create an edge in the outer graph from the subgraph to the target
            const newEdge = graph.createEdge({
                id: uuid(),
                source: graphNode.id,
                sourceHandle: name,
                target: edge.target,
                targetHandle: edge.targetHandle
            });

            //Create an edge in the internal graph
            internalGraph.createEdge({
                id: uuid(),
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: outputNode!.id,
                targetHandle: name
            });


            //We also need to add a flow edge
            reactFlowInstance.addEdges([newEdge]);


        });

        //Reconnect the edges that are internal to the subgraph
        internalEdges.forEach(edge => {
            //Create an edge in the internal graph
            //Do not trigger any updates
            internalGraph.createEdge({
                ...edge,
                noPropagate: true
            });
        });


        // //Remove the selected nodes from the graph
        selectedNodeIds.forEach(id => {
            graph.removeNode(id);
        });




        internalNodes.forEach(node => {
            internalGraph.addNode(node!)
        });

        //Now filter out nodes that were in the original selection
        reactFlowInstance.setNodes((nodes) =>
            [...nodes.filter(x => lookup.has(x.id) == false
            )].concat([flowNode])
        );


        //We then need to find all the downstream nodes from those nodes for the output
    }, [createNode, graph, reactFlowInstance, selectedNodeIds, selectedNodes]);

    const onDuplicate = () => {
        duplicateNodes(selectedNodeIds);
    }



    return (
        <Menu id={id}>
            <Item onClick={onGroup} >Create group</Item>
            <Item onClick={onCreateSubgraph}>Create Subgraph</Item>
            <Separator />
            <Item onClick={onDuplicate} >Duplicate</Item>
        </Menu>
    );
};
