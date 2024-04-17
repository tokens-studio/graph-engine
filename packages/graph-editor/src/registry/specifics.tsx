import { dockerSelector } from "@/redux/selectors/refs";
import { Button } from "@tokens-studio/ui";
import React, { useCallback } from 'react';
import { useSelector } from "react-redux";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { GraphEditor } from "@/editor/graphEditor";
import { ImperativeEditorRef } from "..";

const SubgraphExplorer = ({ node }) => {

    const dockerRef = useSelector(
        dockerSelector,
    );
    const onToggle = useCallback(() => {

        if (!dockerRef?.current) {
            return;
        }

        let oneShot = false;
        const innerGraph = node._innerGraph;
        const graphId = innerGraph.annotations['engine.id'];
        const title = 'Subgraph ' + (innerGraph.annotations['engine.title'] || '');
        //Find the container
        const existing = dockerRef.current.find(graphId);



        const ref = (o: ImperativeEditorRef) => {
            if (o && !oneShot) {
                o.load(innerGraph);
                oneShot =true
            }

        }

        if (!existing) {
            const newTab = {
                cached: true,
                closeable: true,
                id: graphId,
                group: 'graph',
                title,
                content: (
                    <GraphEditor ref={ref} id={graphId} />
                ),
            };

            dockerRef.current.dockMove(newTab, 'graphs', 'middle');
        } else {
            dockerRef.current.updateTab(graphId, null, true);
        }
    }, [dockerRef, node._innerGraph]);



    return <Button icon={<EyeOpenIcon />} onClick={onToggle}>Subgraph Explorer</Button>

}


export const defaultSpecifics = {
    'studio.tokens.generic.subgraph': SubgraphExplorer,
    'studio.tokens.generic.array': SubgraphExplorer
};