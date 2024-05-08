import {
    Menu,
    Item,
    Separator,
} from 'react-contexify';
import React from 'react';
import {
    Node,
    NodeToolbar,
    getRectOfNodes,
    useNodes,
    useReactFlow,
    useStoreApi,
} from 'reactflow';
import { useLocalGraph } from '@/hooks';
import { getId } from '../flow/utils';
import { NodeTypes } from '../flow/types';
import { Edge } from '@tokens-studio/graph-engine';
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

    const onGroup = () => {
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
        };

        const nextNodes: Node[] = nodes.map((node) => {
            if (selectedNodeIds.includes(node.id)) {
                return {
                    ...node,
                    position: {
                        x: node.position.x - parentPosition.x + padding,
                        y: node.position.y - parentPosition.y + padding,
                    },
                    extent: 'parent',
                    parentNode: groupId,
                };
            }

            return node;
        });

        store.getState().resetSelectedElements();
        store.setState({ nodesSelectionActive: false });
        reactFlowInstance.setNodes([groupNode, ...nextNodes]);
    };

    const onCreateSubgraph = () => {

        //We need to work out which nodes do not have parents in the selection

        const lookup = new Set(selectedNodeIds);

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
        }, [] as Edge[])

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
        console.log('finalPosition', finalPosition, selectedNodes.length)

        createNode({
            type: 'studio.tokens.generic.subgraph',
            position: finalPosition
        })

        //We then need to find all the downstream nodes from those nodes for the output
    };

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
