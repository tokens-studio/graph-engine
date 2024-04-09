import { dockerSelector, graphEditorSelector } from "@/redux/selectors/refs";
import { Button, Box } from "@tokens-studio/ui";
import DockLayout from "rc-dock";
import React, { MutableRefObject, useCallback } from 'react';
import { useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import { EditorApp } from "../editor/graph";
import { store } from "@/redux/store";
import { useAutoLayout } from "@/editor/hooks/useAutolayout";
import { graph } from "@/redux/selectors/roots";
import { EyeOpenIcon } from "@radix-ui/react-icons";

const SubgraphExplorer = ({ node }) => {


    const dockerRef = useSelector(
        dockerSelector,
    );
    const layout = useAutoLayout();

    const onToggle = useCallback(() => {

        if (!dockerRef?.current) {
            return;
        }

        const innerGraph = node._innerGraph;
        const graphId = innerGraph.annotations['engine.id'];
        //Find the container
        const existing = dockerRef.current.find(graphId);

        if (!existing) {
            const newTab = {
                //cached: true,
                id: graphId,
                group: 'graph',
                title: 'Subgraph',
                content: (
                    <ReactFlowProvider>
                        <EditorApp id={graphId} />
                    </ReactFlowProvider>

                ),
            };

            dockerRef.current.dockMove(newTab, 'graphs', 'middle');

        } else {
            dockerRef.current.updateTab(graphId, null, true);
        }
    }, [dockerRef, node._innerGraph]);



    return <Button icon={<EyeOpenIcon/>} onClick={onToggle}>Subgraph Explorer</Button>

}


export const defaultSpecifics = {
    'studio.tokens.generic.subgraph': SubgraphExplorer,
    'studio.tokens.generic.array': SubgraphExplorer
};