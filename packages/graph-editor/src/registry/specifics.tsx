import { dockerSelector } from "@/redux/selectors/refs";
import { Button } from "@tokens-studio/ui";
import React, { useCallback } from 'react';
import { useSelector } from "react-redux";
import { useAutoLayout } from "@/editor/hooks/useAutolayout";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { GraphEditor } from "@/editor/graphEditor";

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

        const ref = (o)=>{
            console.log(o)
        }

        if (!existing) {
            const newTab = {
                cached: true,
                id: graphId,
                group: 'graph',
                title: 'Subgraph',
                content: (
                    <GraphEditor ref={ref} id={graphId}/>
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